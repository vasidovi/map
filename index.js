var mousePressed = false;
var lastX, lastY;
var ctx;
var img = new Image();
let riversCoordinates = [];
let mountainsCoordinates = [];

let prevX = 0;
let prevY = 0;

ctx = document.getElementById('myCanvas').getContext("2d");
img.src = "./images/mountains-trial.png";

ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.95;

$('#myCanvas').mousedown(function (e) {
    mousePressed = true;
    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
});

$('#myCanvas').mousemove(function (e) {
    if (mousePressed) {
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    }
});

$('#myCanvas').mouseup(function (e) {
    mousePressed = false;
});
$('#myCanvas').mouseleave(function (e) {
    mousePressed = false;
});

function Draw(x, y, isDown) {

    ctx.save();

    if (activeTool == "mountains") {
        drawMountains(x, y, isDown);
    } else if (activeTool == "rivers") {
        drawRivers(x, y, isDown);
    } else if (activeTool == "corrector") {
        correct(x, y, isDown);
    } else if (activeTool == "eraser") {
        // undoRiverPart(x, y);
        undoMountain(x, y);
    }
    ctx.restore();
};

function drawMountains(x, y, isDown) {
    const size = 35;

    if (isDown) {

        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            mountainsCoordinates.last().push({
                "x": x - size / 2,
                "y": y - size / 2,
                "size": size,
            });
            prevX = x;
            prevY = y;
        }
    } else {
        mountainsCoordinates.push([]);
        prevX = x;
        prevY = y;
    }
    lastX = x;
    lastY = y;
}

function redrawMountains(mountainsCoordinates) {
    
    for (let i = 0; i < mountainsCoordinates.length; i++) {
        let mountainRange = mountainsCoordinates[i];
        for (let j = 1; j < mountainRange.length - 1; j++) {
            ctx.drawImage(img, mountainRange[j].x, mountainRange[j].y, 
                mountainRange[j].size,  mountainRange[j].size);
        }
    }
}

function correct(x, y, isDown) {
    const size = 20;

    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = size;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

function undoRiverPart(x, y) {
    undoElement(x, y, riversCoordinates);
}

function undoRiver(x, y) {
    undoElementGroup(x, y, riversCoordinates);
}

function undoMountain(x, y) {
    undoElement(x, y, mountainsCoordinates);
}

function undoMountainRange(x, y) {
    undoElementGroup(x, y, mountainsCoordinates);
}

function undoElement(x, y, elementGroupsCoordinates) {
    let elementGroupAndElement = findElementGroupAndElement(x, y, elementGroupsCoordinates);
    if (elementGroupAndElement != null) {
        let elementGroupIndex = elementGroupsCoordinates.indexOf(elementGroupAndElement[0]);
        let elementGroup = elementGroupsCoordinates[elementGroupIndex];
        let elementIndex = elementGroup.indexOf(elementGroupAndElement[1]);
        elementGroup.splice(elementIndex, 1);
        redraw();
    }
}

function undoElementGroup(x, y, elementGroupsCoordinates) {

    let elementGroupAndElement = findElementGroupAndElement(x, y, elementGroupsCoordinates);
    if (elementGroupAndElement != null) {
        let elementGroupIndex = elementGroupsCoordinates.indexOf(elementGroupAndElement[0]);
        elementGroupsCoordinates.splice(elementGroupIndex, 1);
        redraw();
    }
}

function undoMountainRange(x, y) {
    let mountainRange = findMountainRange(x, y, mountainsCoordinates);
    if (mountainRange != null) {
        mountainsCoordinates.splice(mountainsCoordinates.indexOf(mountainRange), 1);
        redraw();
    }
}

function redraw() {
    clearArea();
    redrawRivers(riversCoordinates);
    redrawMountains(mountainsCoordinates);
}

function redrawRivers(riversCoordinates) {
    // iterate through all the rivers
    for (let i = 0; i < riversCoordinates.length; i++) {
        let river = riversCoordinates[i];
        for (let j = 1; j < river.length - 1; j++) {
            const startX = river[j - 1].x;
            const startY = river[j - 1].y;
            const endX = river[j].x;
            const endY = river[j].y;
            ctx.beginPath();
            ctx.strokeStyle = "#000";
            // ctx.lineWidth = size;
            ctx.lineJoin = "round";
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}


function findElementGroupAndElement(x, y, elementGroupsCoordinates) {

    if (elementGroupsCoordinates.length > 0) {
        let foundElementGroup = elementGroupsCoordinates.find(function (element) {
            return element.length > 0;
        });
        if (!foundElementGroup) {
            return null;
        }
        let foundElement = foundElementGroup[0];
        let minDifference = Math.abs(x - foundElement.x) + Math.abs(y - foundElement.y);
        for (let i = 0; i < elementGroupsCoordinates.length; i++) {
            let elementGroup = elementGroupsCoordinates[i];
            for (let j = 0; j < elementGroup.length; j++) {
                const difference = Math.abs(x - elementGroup[j].x) + Math.abs(y - elementGroup[j].y);
                if (difference < minDifference) {
                    minDifference = difference;
                    foundElementGroup = elementGroup;
                    foundElement = elementGroup[j];
                }
            }
        }
        return [foundElementGroup, foundElement];
    } else {
        return null;
    }
}

function drawRivers(x, y, isDown) {
    const size = 3;
    const distortion = 1.75;

    if (isDown) {

        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.moveTo(prevX, prevY);
            riversCoordinates.last().push({
                "x": prevX,
                "y": prevY
            });
            prevX = x + (Math.random() - 0.5) * Math.abs(prevX - x) * distortion;
            prevY = y + (Math.random() - 0.5) * Math.abs(prevY - y) * distortion;
            ctx.lineTo(prevX, prevY);
            ctx.stroke();
        }

    } else {
        riversCoordinates.push([]);
        prevX = x;
        prevY = y;
    }
    lastX = x;
    lastY = y;
}

function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
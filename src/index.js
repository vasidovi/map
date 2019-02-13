var mousePressed = false;
var lastX, lastY;
var ctx;
var img = new Image();
let rivers = [];
let mountainRanges = [];
let activeTool;

let prevX = 0;
let prevY = 0;

ctx = document.getElementById('myCanvas').getContext("2d");
img.src = "../res/images/mountains-trial.png";

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
        undoRiverPart(x, y);
        //undoMountain(x, y);
    }
    ctx.restore();
};

function drawMountains(x, y, isDown) {
    const size = 35;

    if (isDown) {
        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            const mountain = new Mountain(x - size / 2, y - size / 2, size, "mountain");
            mountain.draw(ctx);
            mountainRanges.last().elements.push(mountain);
            prevX = x;
            prevY = y;
        }
    } else {
        mountainRanges.push(new MountainRange());
        prevX = x;
        prevY = y;
    }
    lastX = x;
    lastY = y;
}

function redrawMountains(mountainRanges) {

    for (let i = 0; i < mountainRanges.length; i++) {
        let mountainRange = mountainRanges[i];
        mountainRange.draw(ctx);
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
    undoElement(x, y, rivers);
}

function undoRiver(x, y) {
    undoElementGroup(x, y, rivers);
}

function undoMountain(x, y) {
    undoElement(x, y, mountainRanges);
}

function undoMountainRange(x, y) {
    undoElementGroup(x, y, mountainRanges);
}

function undoElement(x, y, elementGroups) {
    let elementGroupAndElement = findElementGroupAndElement(x, y, elementGroups);
    if (elementGroupAndElement != null) {
        let elementGroupIndex = elementGroups.indexOf(elementGroupAndElement[0]);
        let elementGroup = elementGroups[elementGroupIndex];
        let elementIndex = elementGroup.elements.indexOf(elementGroupAndElement[1]);
        elementGroup.elements.splice(elementIndex, 1);
        redraw();
    }
}

function undoElementGroup(x, y, elementGroups) {

    let elementGroupAndElement = findElementGroupAndElement(x, y, elementGroups);
    if (elementGroupAndElement != null) {
        let elementGroupIndex = elementGroups.indexOf(elementGroupAndElement[0]);
        elementGroups.splice(elementGroupIndex, 1);
        redraw();
    }
}

function redraw() {
    clearArea();
    redrawRivers(rivers);
    redrawMountains(mountainRanges);
}

function redrawRivers(rivers) {
    for (let i = 0; i < rivers.length; i++) {
        rivers[i].draw(ctx);
    }
}

function findElementGroupAndElement(x, y, elementGroups) {

    if (elementGroups.length > 0) {
        let foundElementGroup = elementGroups.find(function (group) {
            return group.elements.length > 0;
        });
        if (!foundElementGroup) {
            return null;
        }
        let foundElement = foundElementGroup.elements[0];
        let minDifference = Math.abs(x - foundElement.x) + Math.abs(y - foundElement.y);
        for (let i = 0; i < elementGroups.length; i++) {
            let elementGroup = elementGroups[i];
            let elements = elementGroup.elements;
            for (let j = 0; j < elements.length; j++) {
                const difference = Math.abs(x - elements[j].x) + Math.abs(y - elements[j].y);
                if (difference < minDifference) {
                    minDifference = difference;
                    foundElementGroup = elementGroup;
                    foundElement = elements[j];
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
            prevX = x + (Math.random() - 0.5) * Math.abs(prevX - x) * distortion;
            prevY = y + (Math.random() - 0.5) * Math.abs(prevY - y) * distortion;
            ctx.lineTo(prevX, prevY);
            rivers.last().elements.push( new RiverPart(prevX, prevY));
            ctx.stroke();
        }

    } else {
        rivers.push( new River([new RiverPart(x,y)]));
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

function undoLastAction(){
    
}
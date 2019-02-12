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
    } else if ( activeTool =="eraser") {
        // undoRiver(x,y);
        undoMountainRange(x,y);
    }
    ctx.restore();
};

function drawMountains(x, y, isDown) {
    const size = 35;

    if (isDown) {

        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            mountainsCoordinates.last().push({
                "x":  x - size / 2,
                "y":  y - size / 2,
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

function correct(x, y, isDown) {
    const size = 20;

    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = size;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

function undoRiver(x, y) {

    let river = findRiver(x, y, riversCoordinates);
    if (river != null) {
    riversCoordinates.splice(riversCoordinates.indexOf(river), 1);
    redraw();
    }
}

function undoMountainRange(x,y){
    let mountainRange = findMountainRange(x, y, mountainsCoordinates);
    if (mountainRange != null){
        mountainsCoordinates.splice(mountainsCoordinates.indexOf(mountainRange), 1); 
        redraw();   
    }
}

function redraw(){
    clearArea();
    redrawRivers(riversCoordinates);
    redrawMountains(mountainsCoordinates);
}


function redrawRivers(riversCoordinates){
    if (riversCoordinates.length > 0) {
        // iterate through all the rivers
        for (let i = 0; i < riversCoordinates.length; i++) {
            let river = riversCoordinates[i];
            for (let j = 1; j < river.length-1; j++) {           
            const startX = river[j-1].x;
            const startY = river[j-1].y;
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
}

function findRiver(x, y, riversCoordinates) {

    if (riversCoordinates.length > 0) {
        let foundRiver = riversCoordinates[0];
        let minDifference = Math.abs(x - foundRiver[0].x) + Math.abs(y - foundRiver[0].y);
        // iterate through all the rivers
        for (let i = 0; i < riversCoordinates.length; i++) {
            // iterate through all the river coords
            let river = riversCoordinates[i];
            for (let j = 0; j < river.length; j++) {
                const difference = Math.abs(x - river[j].x) + Math.abs(y - river[j].y);
                if (difference < minDifference) {
                    minDifference = difference;
                    foundRiver = river;
                }
            }
        }
        return foundRiver;
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
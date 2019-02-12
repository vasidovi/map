var mousePressed = false;
var lastX, lastY;
var ctx;
var img = new Image();

// img.onload = function(){
//     image.src = this.src;   
// };
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

let prevX = 0;
let prevY = 0;

function setActiveTool(toolName, button) {
    activeTool = toolName;
    $('.tool-button').removeClass('selected');
    button.addClass('selected');
}

$('#mountains-btn').click(function () {
    setActiveTool("mountains", $(this))
});

$('#rivers-btn').click(function () {
    setActiveTool("rivers", $(this))
});

$('#corrector-btn').click(function () {
    setActiveTool("corrector", $(this))
});

let activeTool;
$('#rivers-btn').click();

function Draw(x, y, isDown) {

    if (activeTool == "mountains") {
        drawMountains(x, y, isDown);
    } else if (activeTool == "rivers") {
        drawRivers(x, y, isDown);
    } else if (activeTool == "corrector") {
        correct(x, y, isDown);
    }
};


function drawMountains(x, y, isDown) {
    const size = 35;

    if (isDown) {

        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
            prevX = x;
            prevY = y;
        }
    } else {
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

        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}


function drawRivers(x, y, isDown) {
    const size = 3;
    const distortion = 1.75;

    if (isDown) {

        if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
            ctx.beginPath();
            // // ctx.strokeStyle = ;
            // // ctx.lineWidth = $('#selWidth').val();
            ctx.lineJoin = "round";
            ctx.moveTo(prevX, prevY);
            prevX = x + (Math.random() - 0.5) * Math.abs(prevX - x) * distortion;
            console.log(Math.abs(prevX - x) * distortion);
            prevY = y + (Math.random() - 0.5) * Math.abs(prevY - y) * distortion;
            ctx.lineTo(prevX, prevY);

            ctx.closePath();
            ctx.stroke();
        }

    } else {
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
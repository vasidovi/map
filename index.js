var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.canvas.width  = window.innerWidth *0.95;
ctx.canvas.height = window.innerHeight * 0.95;

ctx.moveTo(0,0);
ctx.lineTo(200,100);
ctx.stroke();


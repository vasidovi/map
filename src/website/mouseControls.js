import {
	useTool
} from './index.js';

let mousePressed = false;

$('#myCanvas').mousedown(function (e) {
	mousePressed = true;
	useTool(
		e.pageX - $(this).offset().left,
		e.pageY - $(this).offset().top,
		false
	);
});

$('#myCanvas').mousemove(function (e) {
	if (mousePressed) {
		useTool(
			e.pageX - $(this).offset().left,
			e.pageY - $(this).offset().top,
			true
		);
	}
});

$('#myCanvas').mouseup(function (e) {
	mousePressed = false;
});

$('#myCanvas').mouseleave(function (e) {
	mousePressed = false;
});

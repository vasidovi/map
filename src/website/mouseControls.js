import {
	useTool
} from './index.js';

let mousePressed = false;

$('#layer1').mousedown(function (e) {
	mousePressed = true;
	useTool(
		e.pageX - $(this).offset().left,
		e.pageY - $(this).offset().top,
		false
	);
});

$('#layer1').mousemove(function (e) {
	if (mousePressed) {
		useTool(
			e.pageX - $(this).offset().left,
			e.pageY - $(this).offset().top,
			true
		);
	}
});

$('#layer1').mouseup(function (e) {
	mousePressed = false;
});

$('#layer1').mouseleave(function (e) {
	mousePressed = false;
});

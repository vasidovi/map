import {
	useTool
} from './index.js';

let mousePressed = false;
const layer = $('#layer2');

layer.mousedown(function (e) {
	mousePressed = true;
	useTool(
		e.pageX - $(this).offset().left,
		e.pageY - $(this).offset().top,
		false
	);
});

layer.mousemove(function (e) {
	if (mousePressed) {
		useTool(
			e.pageX - $(this).offset().left,
			e.pageY - $(this).offset().top,
			true
		);
	}
});

layer.mouseup(function (e) {
	mousePressed = false;
});

layer.mouseleave(function (e) {
	mousePressed = false;
});

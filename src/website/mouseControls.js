import Tools from './Tools.mjs';

let mousePressed = false;
const layer = $('#layer2');

layer.mousedown(function (e) {
	mousePressed = true;
	Tools.useTool(
		e.pageX - $(this).offset().left,
		e.pageY - $(this).offset().top,
		false
	);
});

layer.mousemove(function (e) {
	if (mousePressed) {
		Tools.useTool(
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

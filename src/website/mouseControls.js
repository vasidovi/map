import Tools from './Tools/Tools.mjs';
import ContextMenu from './ContextMenu.mjs';

let mousePressed = false;
const layer = $('#layer2');

layer.mousedown(function (e) {
	if (e.which !== 1) {
		return;
	}
	mousePressed = true;
	if (ContextMenu.menuVisible)ContextMenu.toggleMenu('hide');
	Tools.useTool(
		e.pageX - $(this).offset().left,
		e.pageY - $(this).offset().top,
		false
	);
});

layer.mousemove(function (e) {
	if (mousePressed || Tools.activeTool.callOnMouseMove) {
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

layer.contextmenu(function (e) {
	e.preventDefault();
	ContextMenu.setPosition(e.pageX, e.pageY);
	return false;
});

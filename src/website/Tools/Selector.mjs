import Tool from './Tool.mjs';
import Canvas from '../Canvas.mjs';
import MapData from '../MapData.mjs';
import Eraser from './Eraser.mjs';

let fixedObject;
const selectCtx = Canvas.selectCtx;

export default class Selector extends Tool {
	constructor () {
		super();
		this.callOnMouseMove = true;
		this.ctxMenu = {
			'Delete selected': Selector.eraseSelectedElement,
			'Deselect': Selector.deselect
		};
	}

	static deselect () {
		fixedObject = null;
		Canvas.clearArea(selectCtx);
	}

	static eraseSelectedElement () {
		if (fixedObject != null) {
			Eraser.eraseElement(fixedObject.x, fixedObject.y);
			fixedObject = null;
		} else {
			console.log('no object selected');
		}
	}

	action (x, y, mouseLeftBtnNotPressed) {
		const nearestObject = MapData.findElementGroupAndElement(x, y)[1];
		if (mouseLeftBtnNotPressed) {
			Canvas.clearArea(selectCtx);
			if (fixedObject) {
				fixedObject.select(selectCtx);
			}
			nearestObject.highlight(selectCtx);
		} else {
			console.log('x ' + fixedObject);
			console.log('y ' + fixedObject);
			if (nearestObject !== fixedObject) {
				fixedObject = nearestObject;
			} else {
				fixedObject = null;
				Canvas.clearArea(selectCtx);
			}
		}
	}
}

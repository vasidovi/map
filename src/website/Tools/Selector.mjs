import Tool from './Tool.mjs';
import Canvas from '../Canvas.mjs';
import MapData from '../MapData.mjs';

let fixedObject;
const selectCtx = Canvas.selectCtx;

export default class Selector extends Tool {
	constructor () {
		super();
		this.callOnMouseMove = true;
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
			if (nearestObject !== fixedObject) {
				fixedObject = nearestObject;
			} else {
				fixedObject = null;
				Canvas.clearArea(selectCtx);
			}
		}
	}
}

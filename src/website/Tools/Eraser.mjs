import Tool from './Tool.mjs';
import History from '../History.mjs';
import MapData from '../MapData.mjs';
import Canvas from '../Canvas.mjs';

const selectCtx = Canvas.selectCtx;

function saveErasingHistory (
	type,
	scope,
	groupValue,
	elementIndex,
	elementValue
) {
	const historyEntry = {};
	historyEntry.type = type;
	historyEntry.action = 'removed';
	historyEntry.scope = scope;
	historyEntry.groupValue = groupValue;
	historyEntry.elementIndex = elementIndex;
	historyEntry.elementValue = elementValue;
	History.history.push(historyEntry);
}

export default class Eraser extends Tool {
	constructor () {
		super();
		this.callOnMouseMove = true;
	}

	action (x, y, mouseLeftBtnNotPressed) {
		const nearestObject = MapData.findElementGroupAndElement(x, y)[1];
		if (mouseLeftBtnNotPressed) {
			Canvas.clearArea(selectCtx);
			nearestObject.highlight(selectCtx);
		} else {
			this.eraseElement(x, y);
		}
	}

	eraseElement (x, y) {
		let elementGroupAndElement = MapData.findElementGroupAndElement(x, y);
		if (elementGroupAndElement != null) {
			let elementGroup = elementGroupAndElement[0];
			let elementIndex = elementGroup.elements.indexOf(elementGroupAndElement[1]);
			elementGroup.elements.splice(elementIndex, 1);
			MapData.redraw();

			saveErasingHistory(
				elementGroup.elementType,
				'element',
				elementGroupAndElement[0],
				elementIndex,
				elementGroupAndElement[1]
			);
		}
	}

	// static eraseElementGroup (x, y) {
	// 	let elementGroupAndElement = MapData.findElementGroupAndElement(x, y);
	// 	if (elementGroupAndElement != null) {
	// 		let elementGroupIndex = elementGroups.indexOf(elementGroupAndElement[0]);
	// 		elementGroups.splice(elementGroupIndex, 1);
	// 		redraw();
	// 		saveErasingHistory(
	// 			elementGroup.elementType,
	// 			'group',
	// 			elementGroupAndElement[0]
	// 		);
	// 	}
	// }
}

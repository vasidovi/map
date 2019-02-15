import MountainRange from './models/MountainRange.mjs';
import Mountain from './models/Mountain.mjs';
import River from './models/River.mjs';
import RiverPart from './models/RiverPart.mjs';
import MapData from './MapData.mjs';
import History from './History.mjs';
import Canvas from './Canvas.mjs';

var lastX, lastY;

let activeTool = {};

let rivers = MapData.data.rivers;
let mountainRanges = MapData.data.mountainRanges;

let prevX = 0;
let prevY = 0;

let ctx1 = Canvas.mainCtx;
let ctx2 = Canvas.selectCtx;

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

let fixedObject;

export default class Tools {
	static get activeTool () {
		return activeTool;
	}

	static setActiveTool (toolName) {
		activeTool = tools[toolName];
		if (!activeTool) {
			console.log(`Couldn't find tool by name '${toolName}'`);
		}
	}

	static useTool (x, y, isDown) {
		ctx1.save();

		if (activeTool) {
			activeTool.action(x, y, isDown);
		} else {
			console.log('No active tool has been set');
		}
		ctx1.restore();
	}

	static getContextMenu () {
		ctx1.save();
		if (activeTool.ctxMenu) {
			alert('trying to load context menu');
			$('.context-menu').css('display', 'block');
		} else {
			console.log('No active tool has been set');
		}
		ctx1.restore();
	}

	static markSelected (x, y, mouseLeftBtnNotPressed) {
		const nearestObject = MapData.findElementGroupAndElement(x, y)[1];
		if (mouseLeftBtnNotPressed) {
			Canvas.clearArea(ctx2);
			if (fixedObject) {
				fixedObject.select(ctx2);
			}
			nearestObject.highlight(ctx2);
		} else {
			if (nearestObject !== fixedObject) {
				fixedObject = nearestObject;
			} else {
				fixedObject = null;
				Canvas.clearArea(ctx2);
			}
		}
	}

	static markToBeErased (x, y, mouseLeftBtnNotPressed) {
		const nearestObject = MapData.findElementGroupAndElement(x, y)[1];
		if (mouseLeftBtnNotPressed) {
			Canvas.clearArea(ctx2);
			nearestObject.highlight(ctx2);
		} else {
			Tools.eraseElement(x, y);
		}
	}

	static formMountains (x, y, isDown) {
		const size = 35;

		if (isDown) {
			if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
				const mountain = new Mountain(x, y, size, 'mountain');
				mountain.draw(ctx1);
				mountainRanges.last().elements.push(mountain);
				prevX = x;
				prevY = y;
			}
		} else {
			mountainRanges.push(new MountainRange());
			const mountain = new Mountain(x, y, size, 'mountain');
			mountain.draw(ctx1);
			mountainRanges.last().elements.push(mountain);

			const historyEntry = {};
			historyEntry.action = 'added';
			historyEntry.type = 'mountainRange';
			History.history.push(historyEntry);
			prevX = x;
			prevY = y;
		}
		lastX = x;
		lastY = y;
	}

	static formRivers (x, y, isDown) {
		const size = 3;
		const distortion = 1.75;

		if (isDown) {
			if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
				ctx1.beginPath();
				ctx1.lineJoin = 'round';
				ctx1.moveTo(prevX, prevY);
				prevX = x + (Math.random() - 0.5) * Math.abs(prevX - x) * distortion;
				prevY = y + (Math.random() - 0.5) * Math.abs(prevY - y) * distortion;
				ctx1.lineTo(prevX, prevY);
				rivers.last().elements.push(new RiverPart(prevX, prevY));
				ctx1.stroke();
			}
		} else {
			rivers.push(new River([new RiverPart(x, y)]));
			const historyEntry = {};
			historyEntry.action = 'added';
			historyEntry.type = 'river';
			History.history.push(historyEntry);
			prevX = x;
			prevY = y;
		}
		lastX = x;
		lastY = y;
	}

	static correct (x, y, isDown) {
		const size = 20;

		if (isDown) {
			ctx1.beginPath();
			ctx1.strokeStyle = '#fff';
			ctx1.lineWidth = size;
			ctx1.lineJoin = 'round';
			ctx1.moveTo(lastX, lastY);
			ctx1.lineTo(x, y);
			ctx1.closePath();
			ctx1.stroke();
		}
		lastX = x;
		lastY = y;
	}

	static eraseElement (x, y) {
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

const tools = {
	mountains: {
		action: Tools.formMountains
	},
	rivers: {
		action: Tools.formRivers
	},
	corrector: {
		action: Tools.correct
	},
	eraser: {
		// action: Tools.eraseElement
		action: Tools.markToBeErased,
		callOnMouseMove: true
	},
	selector: {
		action: Tools.markSelected,
		callOnMouseMove: true,
		ctxMenu: true
	}
};

import MountainRange from './models/MountainRange.mjs';
import Mountain from './models/Mountain.mjs';
import River from './models/River.mjs';
import RiverPart from './models/RiverPart.mjs';
import MapData from './MapData.mjs';
import History from './History.mjs';

var lastX, lastY;
var ctx;
export const activeTool = {};

let rivers = MapData.data.rivers;
let mountainRanges = MapData.data.mountainRanges;

let prevX = 0;
let prevY = 0;

ctx = document.getElementById('myCanvas').getContext('2d');
ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.95;

const tools = {
	mountains: formMountains,
	rivers: formRivers,
	corrector: correct,
	eraser: eraseElement
};

export function useTool (x, y, isDown) {
	ctx.save();

	const tool = tools[activeTool.name];
	if (tool) {
		tool(x, y, isDown);
	} else {
		console.log(`Couldn't process tool '${activeTool.name}'`);
	}

	ctx.restore();
}

function formMountains (x, y, isDown) {
	const size = 35;

	if (isDown) {
		if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
			const mountain = new Mountain(
				x - size / 2,
				y - size / 2,
				size,
				'mountain'
			);
			mountain.draw(ctx);
			mountainRanges.last().elements.push(mountain);
			prevX = x;
			prevY = y;
		}
	} else {
		mountainRanges.push(new MountainRange());
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

function redrawMountains (mountainRanges) {
	for (let i = 0; i < mountainRanges.length; i++) {
		let mountainRange = mountainRanges[i];
		mountainRange.draw(ctx);
	}
}

function correct (x, y, isDown) {
	const size = 20;

	if (isDown) {
		ctx.beginPath();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = size;
		ctx.lineJoin = 'round';
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
	}
	lastX = x;
	lastY = y;
}

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

function eraseElement (x, y) {
	let elementGroupAndElement = MapData.findElementGroupAndElement(x, y);
	if (elementGroupAndElement != null) {
		let elementGroup = elementGroupAndElement[0];
		let elementIndex = elementGroup.elements.indexOf(elementGroupAndElement[1]);
		elementGroup.elements.splice(elementIndex, 1);
		redraw();

		saveErasingHistory(
			elementGroup.elementType,
			'element',
			elementGroupAndElement[0],
			elementIndex,
			elementGroupAndElement[1]
		);
	}
}

// function eraseElementGroup (x, y) {
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

export function redraw () {
	clearArea();
	redrawRivers(rivers);
	redrawMountains(mountainRanges);
}

function redrawRivers (rivers) {
	for (let i = 0; i < rivers.length; i++) {
		rivers[i].draw(ctx);
	}
}

function formRivers (x, y, isDown) {
	const size = 3;
	const distortion = 1.75;

	if (isDown) {
		if (Math.abs(x - prevX) >= size || Math.abs(y - prevY) >= size) {
			ctx.beginPath();
			ctx.lineJoin = 'round';
			ctx.moveTo(prevX, prevY);
			prevX = x + (Math.random() - 0.5) * Math.abs(prevX - x) * distortion;
			prevY = y + (Math.random() - 0.5) * Math.abs(prevY - y) * distortion;
			ctx.lineTo(prevX, prevY);
			rivers.last().elements.push(new RiverPart(prevX, prevY));
			ctx.stroke();
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

function clearArea () {
	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

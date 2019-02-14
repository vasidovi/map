import {
	MountainRange
} from './models/MountainRange.mjs';
import {
	Mountain
} from './models/Mountain.mjs';
import {
	River
} from './models/River.mjs';
import {
	RiverPart
} from './models/RiverPart.mjs';
import MapData from './MapData.mjs';

var mousePressed = false;
var lastX, lastY;
var ctx;
export const activeTool = {};

let rivers = MapData.data.rivers;
let mountainRanges = MapData.data.mountainRanges;

const history = [];
let prevX = 0;
let prevY = 0;

ctx = document.getElementById('myCanvas').getContext('2d');
ctx.canvas.width = window.innerWidth * 0.95;
ctx.canvas.height = window.innerHeight * 0.95;

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

function useTool (x, y, isDown) {
	ctx.save();
	// console.log( "we are in draw" + activeTool);
	if (activeTool.name === 'mountains') {
		formMountains(x, y, isDown);
	} else if (activeTool.name === 'rivers') {
		formRivers(x, y, isDown);
	} else if (activeTool.name === 'corrector') {
		correct(x, y, isDown);
	} else if (activeTool.name === 'eraser') {
		eraseElement(x, y);
	}
	// updateHistory(activeTool);
	ctx.restore();
}

export function undoLastAction () {
	if (history.length > 0) {
		const lastEntry = history.last();
		if (lastEntry.action === 'added') {
			if (lastEntry.type === 'mountainRange') {
				mountainRanges.pop();
			} else if (lastEntry.type === 'river') {
				rivers.pop();
			}
		} else if (lastEntry.action === 'removed') {
			if (lastEntry.type === 'mountainRange') {
				if (lastEntry.scope === 'group') {
					mountainRanges.push(lastEntry.groupValue);
				} else if (lastEntry.scope === 'element') {
					const mountainRange = lastEntry.groupValue;
					mountainRange.elements.splice(
						lastEntry.elementIndex,
						0,
						lastEntry.elementValue
					);
				}
			} else if (lastEntry.type === 'river') {
				if (lastEntry.scope === 'group') {
					rivers.push(lastEntry.groupValue);
				} else if (lastEntry.scope === 'element') {
					const river = lastEntry.groupValue;
					river.elements.splice(
						lastEntry.elementIndex,
						0,
						lastEntry.elementValue
					);
				}
			}
		}
		history.pop();
		redraw();
	}
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
		history.push(historyEntry);
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
	history.push(historyEntry);
}

function eraseElement (x, y, query) {
	let elementGroupAndElement = MapData.findElementGroupAndElement(x, y, query);
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

// function eraseElementGroup (x, y, query) {
// 	let elementGroupAndElement = MapData.findElementGroupAndElement(x, y, query);
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
		history.push(historyEntry);
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

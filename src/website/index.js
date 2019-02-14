import MountainRange from './models/MountainRange.mjs';
import Mountain from './models/Mountain.mjs';
import River from './models/River.mjs';
import RiverPart from './models/RiverPart.mjs';
import MapData from './MapData.mjs';

var mousePressed = false;
var lastX, lastY;
var ctx1;
// var ctx2;
export const activeTool = {};

let rivers = MapData.data.rivers;
let mountainRanges = MapData.data.mountainRanges;

const history = [];
let prevX = 0;
let prevY = 0;

ctx1 = document.getElementById('layer1').getContext('2d');
ctx1.canvas.width = window.innerWidth * 0.95;
ctx1.canvas.height = window.innerHeight * 0.95;

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

function useTool (x, y, isDown) {
	ctx1.save();
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
	ctx1.restore();
}

function markSelection () {

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
			mountain.draw(ctx1);
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
		mountainRange.draw(ctx1);
	}
}

function correct (x, y, isDown) {
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
		rivers[i].draw(ctx1);
	}
}

function formRivers (x, y, isDown) {
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
		history.push(historyEntry);
		prevX = x;
		prevY = y;
	}
	lastX = x;
	lastY = y;
}

function clearArea () {
	// Use the identity matrix while clearing the canvas
	ctx1.setTransform(1, 0, 0, 1, 0, 0);
	ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
}

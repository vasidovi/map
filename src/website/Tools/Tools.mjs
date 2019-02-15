import MountainRange from '../models/MountainRange.mjs';
import Mountain from '../models/Mountain.mjs';
import River from '../models/River.mjs';
import RiverPart from '../models/RiverPart.mjs';
import MapData from '../MapData.mjs';
import History from '../History.mjs';
import Canvas from '../Canvas.mjs';

import Corrector from './Corrector.mjs';
import Eraser from './Eraser.mjs';
import Selector from './Selector.mjs';

let activeTool = {};

let rivers = MapData.data.rivers;
let mountainRanges = MapData.data.mountainRanges;

let prevX = 0;
let prevY = 0;

let ctx1 = Canvas.mainCtx;

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
	}
}

const tools = {
	mountains: {
		action: Tools.formMountains
	},
	rivers: {
		action: Tools.formRivers
	},
	corrector: new Corrector(),
	eraser: new Eraser(),
	selector: new Selector()
};

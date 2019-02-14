import MapData from './MapData.mjs';
import { redraw } from './index.js';

const history = [];

export default class History {
	static get history () {
		return history;
	}

	static undoLastAction () {
		if (history.length > 0) {
			const lastEntry = history.last();
			if (lastEntry.action === 'added') {
				if (lastEntry.type === 'mountainRange') {
					MapData.data.mountainRanges.pop();
				} else if (lastEntry.type === 'river') {
					MapData.data.rivers.pop();
				}
			} else if (lastEntry.action === 'removed') {
				if (lastEntry.type === 'mountainRange') {
					if (lastEntry.scope === 'group') {
						MapData.data.mountainRanges.push(lastEntry.groupValue);
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
						MapData.data.rivers.push(lastEntry.groupValue);
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
}

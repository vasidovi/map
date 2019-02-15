import Tool from './Tool.mjs';
import Canvas from '../Canvas.mjs';

let lastX;
let lastY;
const mainCtx = Canvas.mainCtx;

export default class Corrector extends Tool {
	action (x, y, isDown) {
		const size = 20;

		if (isDown) {
			mainCtx.beginPath();
			mainCtx.strokeStyle = '#fff';
			mainCtx.lineWidth = size;
			mainCtx.lineJoin = 'round';
			mainCtx.moveTo(lastX, lastY);
			mainCtx.lineTo(x, y);
			mainCtx.closePath();
			mainCtx.stroke();
		}
		lastX = x;
		lastY = y;
	}
}

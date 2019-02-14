import Element from './Element.mjs';

export default class RiverPart extends Element {
	highlight (ctx) {
		ctx.strokeStyle = '#3c6dff';
		// ctx.fillRect(this.x, this.y, 10, 10);
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

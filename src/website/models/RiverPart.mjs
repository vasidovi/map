import Element from './Element.mjs';

export default class RiverPart extends Element {
	highlight (ctx) {
		ctx.strokeStyle = '#3c6dff';
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
	}
	select (ctx) {
		ctx.strokeStyle = 'green';
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

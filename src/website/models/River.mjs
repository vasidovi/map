import ElementGroup from './ElementGroup.mjs';

export default class River extends ElementGroup {
	get elementType () {
		return 'river';
	}

	constructor (elements, branches) {
		super(elements);
		this.branches = branches || [];
	}

	// @Override
	draw (ctx) {
		// super.draw(ctx);
		if (this.elements.length === 0) {
			return;
		}
		ctx.strokeStyle = '#000';
		ctx.lineJoin = 'round';
		ctx.beginPath();
		ctx.moveTo(this.elements[0].x, this.elements[0].y);
		for (let i = 1; i < this.elements.length - 1; i++) {
			const nextX = this.elements[i].x;
			const nextY = this.elements[i].y;
			ctx.lineTo(nextX, nextY);
		}
		ctx.stroke();
		this.branches.forEach(e => {
			e.draw(ctx);
		});
	}
}

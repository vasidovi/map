import Resources from '../Resources.js';
import Element from './Element.mjs';

export default class Mountain extends Element {
	constructor (x, y, size, type) {
		super(x, y);
		this.type = type;
		this.size = size;
	}

	drawImage (ctx, image) {
		ctx.drawImage(image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
	}

	draw (ctx) {
		Resources.load(this.type, (image) => {
			this.drawImage(ctx, image);
		});
	}

	highlight (ctx) {
		Resources.load(this.type + '-selected', (image) => {
			this.drawImage(ctx, image);
		});
	}
}

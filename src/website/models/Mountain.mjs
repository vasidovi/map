import Resources from '../Resources.js';
import Element from './Element.mjs';

export default class Mountain extends Element {
	constructor (x, y, size, type) {
		super(x, y);
		this.type = type;
		this.size = size;
	}

	draw (ctx) {
		Resources.load(this.type, (image) => {
			ctx.drawImage(image, this.x, this.y, this.size, this.size);
		});
	}
}

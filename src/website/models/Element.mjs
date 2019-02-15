export default class Element {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	draw () {
		console.log('drawing element');
	}
	highlight () {
		console.log('highlight element');
	}
	select () {
		console.log('select element');
	}
}

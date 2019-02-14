const contexts = {};

const mainCtx = contexts.mainCtx = initializeContext('layer1');
const selectCtx = contexts.selectCtx = initializeContext('layer2');

function initializeContext (canvasId) {
	const ctx = document.getElementById(canvasId).getContext('2d');
	ctx.canvas.width = window.innerWidth * 0.95;
	ctx.canvas.height = window.innerHeight * 0.95;
	return ctx;
}

export default class Canvas {
	static get mainCtx () {
		return mainCtx;
	}

	static get selectCtx () {
		return selectCtx;
	}

	static clearArea (ctx) {
		const ctxs = ctx ? [ctx] : Object.values(contexts);
		// Use the identity matrix while clearing the canvas
		ctxs.forEach(ctx => {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		});
	};
};

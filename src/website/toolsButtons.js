// import Vue from 'vue';
import History from './History.mjs';
import Tools from './Tools/Tools.mjs';
import {
	saveMap } from './webservices.mjs';

const data = {
	tools: [{
		name: 'undo',
		title: 'Undo',
		src: 'https://cdn2.iconfinder.com/data/icons/toolbar-icons/512/Undo_Arrow-512.png',
		action: History.undoLastAction
	}, {
		name: 'save',
		title: 'Save',
		src: 'https://cdn3.iconfinder.com/data/icons/vector-icons-for-mobile-apps-2/512/Save_black-512.png',
		action: saveMap
	}, {
		name: 'mountains',
		title: 'Mountains',
		src: 'https://cdn3.iconfinder.com/data/icons/pyconic-icons-1-2/512/mountain-512.png'
	},
	{
		name: 'rivers',
		title: 'Rivers',
		src: 'https://cdn0.iconfinder.com/data/icons/energy-and-power-3/512/131-512.png'
	},
	{
		name: 'corrector',
		title: 'Corrector',
		src: 'https://image.flaticon.com/icons/svg/1440/1440157.svg'
	},
	{
		name: 'eraser',
		title: 'Eraser',
		src: 'https://cdn3.iconfinder.com/data/icons/text/100/eraser-512.png'
	},
	{
		name: 'selector',
		title: 'Select',
		src: 'https://cdn2.iconfinder.com/data/icons/dottie-design-part-2/24/design_055-quick_selection-tool-marquee-graphic-512.png'
	}
	],
	setActiveTool: function (tool) {
		if (tool.action) {
			tool.action();
		} else {
			data.tools.forEach(e => {
				e.isActive = false;
			});
			tool.isActive = true;
			Tools.setActiveTool(tool.name);
		}
	}
};
data.setActiveTool(data.tools.find(e => e.name === 'selector'));

const app = new Vue({
	el: '#tools',
	data
});

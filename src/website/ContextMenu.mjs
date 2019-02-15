import Canvas from './Canvas.mjs';
import Tools from './Tools/Tools.mjs';

const menuOptions = $('#menu-options');
const menu = document.querySelector('#context-menu');

let menuVisible = false;

export default class ContextMenu {
	static get menuVisible () {
		return menuVisible;
	}

	static setPosition (left, top) {
		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;
		this.toggleMenu('show');
	}

	static toggleMenu (command) {
		if (command === 'show' && menuOptions.children().length > 0) {
			menu.style.display = 'block';
		} else {
			menu.style.display = 'none';
		}
		menuVisible = !menuVisible;
	}

	static setMenuOptions (options) {
		menuOptions.empty();
		var li = [];
		if (options) {
			const keys = Object.keys(options);
			keys.forEach(key => {
				li.push('<li class="menu option">' + key + '</li>');
				// menuOptions.append($('li').text(key));
			});
			menuOptions.append(li.join(''));
		}
	}

	static getContextMenu () {
		Canvas.mainCtx.save();
		if (Tools.activeTool.ctxMenu) {
			alert('trying to load context menu');
			$('.context-menu').css('display', 'block');
		} else {
			console.log('No active tool has been set');
		}
		Canvas.mainCtx.restore();
	}
}

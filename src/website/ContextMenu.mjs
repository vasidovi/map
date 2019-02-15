const menu = document.querySelector('.context-menu');
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
		if (command === 'show') {
			menu.style.display = 'block';
		} else {
			menu.style.display = 'none';
		}
		menuVisible = !menuVisible;
	}
}

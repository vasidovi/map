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
		if (options) {
			const keys = Object.keys(options);
			keys.forEach(key => {
				const child = $('<li>').text(key).addClass('menu-option');
				menuOptions.append(child);
				child.click(options[key]);
			});
		} else {
			if (ContextMenu.menuVisible) ContextMenu.toggleMenu('hide');
		}
	}
}

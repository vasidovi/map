import { saveMap } from './webservices.js';
import History from './History.mjs';

$(document).bind('keydown', 'ctrl+s', function (e) {
	e.preventDefault();
	saveMap();
	return false;
});

$(document).bind('keydown', 'ctrl+z', History.undoLastAction);

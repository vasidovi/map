import MapData from './MapData.mjs';

import MountainRange from './models/MountainRange.mjs';
import Mountain from './models/Mountain.mjs';
import River from './models/River.mjs';
import RiverPart from './models/RiverPart.mjs';

const routes = {
	map: '/map'
};

export function saveMap () {
	const data = MapData.data;

	const serializedData = serialize(data);

	$.ajax({
		url: routes.map,
		type: 'POST',
		data: serializedData,
		contentType: 'application/json',
		success: function (response, s) {
			console.log(response);
		},
		error: function (_, status) {
			console.log(status);
			console.log('Failed to save map.');
		}
	});
}

export function loadMap () {
	$.ajax({
		url: routes.map,
		type: 'GET',
		success: function (response) {
			const string = JSON.stringify(response);

			var data = deserialize(string);

			// Expect all fields to be arrays
			Object.keys(MapData.data).forEach(key => {
				if (data[key]) {
					MapData.data[key].length = 0;
					MapData.data[key].push(...data[key]);
				}
			});

			MapData.redraw();
		},
		error: function (_, status) {
			console.log(status);
			console.log('Failed to get map.');
		}
	});
}
loadMap();

const types = {
	River,
	RiverPart,
	MountainRange,
	Mountain
};

// https://stackoverflow.com/questions/21704318/javascript-nested-typed-object-to-json-and-back
function serialize (data) {
	return JSON.stringify(data, function replacer (key, value) {
		// warning this change the object. maybe use $.extend or xtend, or a deep clone library
		if (typeof value === 'object') {
			value.__type = value.constructor.name;
		}
		return value;
	});
}

function deserialize (string) {
	return JSON.parse(string, function reviver (key, value) {
		const Type = types[value.__type];
		if (Type) {
			var p = new Type();
			Object.getOwnPropertyNames(value).forEach(function (k) {
				p[k] = value[k];
			});
			return p;
		}
		return value;
	});
}

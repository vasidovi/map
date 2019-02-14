const data = {};
data.rivers = [];
data.mountainRanges = [];

export default class MapData {
	static get data () {
		return data;
	}

	static findElementGroupAndElement (x, y, query) {
		let searchData = data.rivers.concat(data.mountainRanges);
		if (query === 'rivers') {
			searchData = data.rivers;
		} else if (query === 'mountainRanges') {
			searchData = data.mountainRanges;
		}

		if (searchData.length > 0) {
			let foundElementGroup = searchData.find(function (group) {
				return group.elements.length > 0;
			});
			if (!foundElementGroup) {
				return null;
			}
			let foundElement = foundElementGroup.elements[0];
			let minDifference = Math.abs(x - foundElement.x) + Math.abs(y - foundElement.y);
			for (let i = 0; i < searchData.length; i++) {
				let elementGroup = searchData[i];
				let elements = elementGroup.elements;
				for (let j = 0; j < elements.length; j++) {
					const difference =
						Math.abs(x - elements[j].x) + Math.abs(y - elements[j].y);
					if (difference < minDifference) {
						minDifference = difference;
						foundElementGroup = elementGroup;
						foundElement = elements[j];
					}
				}
			}
			return [foundElementGroup, foundElement, minDifference];
		} else {
			return null;
		}
	}
}

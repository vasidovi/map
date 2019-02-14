const loadedImages = {};
const sources = {
	'mountain': '/images/mountains-trial.png'
};

export default class Resources {
	static get sources () {
		return sources;
	}

	static get loadedImages () {
		return loadedImages;
	}

	static load (key, callback) {
		let image = this.loadedImages[key];
		if (!image) {
			image = new Image();
			image.onload = () => {
				loadedImages[key] = image;
				callback(image);
			};
			image.src = this.sources[key];
		} else {
			callback(image);
		}
	}
}

Object.keys(sources).forEach(k => {
	if (!document.location.hostname) {
		// route to local path for no-server testing
		sources[k] = '../../res' + sources[k];
	}
});

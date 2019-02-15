const loadedImages = {};
const sources = {
	'mountain': '/images/mountains-trial.png'
};

const colors = {
	highlighted: {
		b: 255
	},
	selected: {
		g: 255
	}
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
			setImageSource(image, key, this.sources[key]);
		} else {
			callback(image);
		}
	}
}

function setImageSource (image, key, src) {
	if (src) {
		image.src = src;
	} else {
		const colorKey = key.split('-')[1];
		colorImage('mountain', colors[colorKey], src => {
			image.src = src;
		});
	}
}

function colorImage (key, color, callback) {
	// Setup
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var img = new Image();

	// When the image has loaded
	img.onload = function () {
		// Draw it and get it's data
		canvas.width = img.width;
		canvas.height = img.height;

		ctx.drawImage(img, 0, 0);
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		var data = imgData.data;

		// Iterate over all the pixels
		for (var i = 0; i < data.length; i += 4) {
			data[i] = color.r || data[i]; // Red
			data[i + 1] = color.g || data[i + 1]; // Green
			data[i + 2] = color.b || data[i + 2]; // Blue
		}

		// Re-draw the image.
		ctx.putImageData(imgData, 0, 0);
		callback(canvas.toDataURL('image/png'));
	};

	// Load image
	img.src = sources[key];
}

const loadedImages = {};
const sources = {
    "mountain": "/images/mountains-trial.png",
};

class Resources {

    static get sources() {
        return sources;
    }

    static get loadedImages() {
        return loadedImages;
    }

    static load(key, callback) {
        let image = this.loadedImages[key];

        if (!image) {
            image = new Image();
            image.onload = () => {
                console.log('loaded')
                loadedImages[key] = image;
                callback(image);
            };
            image.src = this.sources[key];
        } else {
            callback(image);
        }
    }
}

function loadImage(url) {
    let i = new Image();
    i.src = url;
    return i;
}

Object.keys(sources).forEach(k => {
    if (!document.location.hostname) {

        // route to local path for no-server testing
        sources[k] = "../../res" + sources[k]
    }
})
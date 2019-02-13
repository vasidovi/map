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

    static load(key) {
        let image = this.loadedImages[key];
        if (!image) {
            image = new Image();
            image.src = this.sources[key];
            loadedImages[key] = image;
        }
        return image;
    }
}

Object.keys(sources).forEach(k => {
    if (!document.location.hostname) {

        // route to local path for no-server testing
        sources[k] = "../../res" + sources[k]
    } else {

        // shouldn't draw before loaded, thats why we preload
        Resources.load(k)
    }
})

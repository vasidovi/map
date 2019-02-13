const loadedImages = {};
const sources = {"mountain": "../res/images/mountains-trial.png",};

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
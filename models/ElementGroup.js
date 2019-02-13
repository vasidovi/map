class ElementGroup {
    constructor(elements) {
        this.elements = elements || []
    }

    findNearest() {
        return []
    }
    draw() {
        console.log('drawing group')
        elements.forEach(e => {
            e.draw()
        });
    }
}
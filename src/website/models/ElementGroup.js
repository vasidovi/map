class ElementGroup {
    constructor(elements) {
        this.elements = elements || []
    }

    findNearest() {
        return []
    }
    draw(ctx) {
        this.elements.forEach(e => {
            e.draw(ctx)
        });
    }
}
class River extends ElementGroup {
    constructor(elements, branches) {
        super(elements)
        this.branches = branches || []
    }

    draw() {
        super.draw()
        branches.forEach(e => {
            e.draw();
        });
    }
}
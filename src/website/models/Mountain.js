class Mountain extends Element {
    constructor(x, y, size, type) {
        super(x,y);
        this.type = type;
        this.size = size;
        this.src = "//ssss";
    }

    draw(ctx){
        const img = Resources.load(this.type);
        ctx.drawImage(img, this.x, this.y,
            this.size, this.size);
    }
    
}



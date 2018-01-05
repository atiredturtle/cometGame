class Explosion {
    constructor(obj, dist, maxSize, color) {
        this.maxSize = maxSize;
        this.size = CELLSIZE;
        this.obj = obj;
        this.dist = dist;
        this.growRate = 1.5;
        this.done = false
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }
    update() {
        if (this.size < this.maxSize){
            this.size *= this.growRate;
            drawCircle(this.obj.x, this.obj.y, this.size, this.color);
            drawCircle(this.obj.x+this.dist, this.obj.y, this.size, this.color);
            drawCircle(this.obj.x, this.obj.y+this.dist, this.size, this.color);
            drawCircle(this.obj.x+this.dist, this.obj.y+this.dist, this.size, this.color);
            
            this.x = this.obj.x - this.size;
            this.y = this.obj.y - this.size;
            this.width = this.size*2+this.dist
            this.height = this.width;
            // show hitbox
            // ctx.strokeStyle = "white";
            // ctx.rect(this.x,this.y,this.width,this.height);
            // ctx.stroke();
        } else {
            this.done = true;
        }
    }
}
class Enemy {
    constructor() {
        this.speed = CELLSIZE/5;
        this.color = "white"
        this.health = this.color.length - 1;
        this.width = CELLSIZE;
        this.height = CELLSIZE;
        this.quadrant = parseInt(Math.random()*4);
        this.randWidth = Math.random()*canvas.width;
        this.randHeight = Math.random()*canvas.height;
        this.x = this.calcX();
        this.y = this.calcY();
        this.LEFT = 0;
        this.RIGHT = 1;
        this.UP = 2;
        this.DOWN = 3;
    }

    calcX() {
        if (this.quadrant == this.LEFT){
            return -this.width;
        } 
        else if (this.quadrant == this.RIGHT){
            return canvas.width + this.width;
        } else {
            return this.randWidth;
        }
    }
    
    calcY() {
         if (this.quadrant == this.UP){
            return -this.height;
        } 
        else if (this.quadrant == this.DOWN){
            return canvas.height + this.height;
        } else {
            return this.randHeight;
        }
    }

    getDirection(){
        let width = char.x - this.x;
        let height = char.y - this.y;
        let theta = Math.atan(abs(height/width));
        this.vx = width/abs(width) * this.speed * cos(theta);
        this.vy = height/abs(height) * this.speed * sin(theta);
    }
    
    update(){
        ctx.fillStyle = this.color[this.health];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.getDirection();
        this.x += this.vx;
        this.y += this.vy;
    }
}
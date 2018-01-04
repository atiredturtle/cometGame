class Enemy {
    constructor() {
        this.speed = CELLSIZE/5;
        this.color = "white"
        this.health = this.color.length - 1;
        this.width = CELLSIZE;
        this.height = CELLSIZE;
        this.quadrant = parseInt(Math.random()*4);
        this.randWidth  = Math.random()*canvas.width;
        this.randHeight = Math.random()*canvas.height;
        this.x = this.getFirstX();
        this.y = this.getFirstY();
    }

    getFirstX() {
        // left
        if (this.quadrant == 0){
            return -this.width;
        } 

        // right
        else if (this.quadrant == 1){
            return canvas.width + this.width;
        } else {
            return this.randWidth;
        }
    }
    
    getFirstY() {
        // up
        if (this.quadrant == 2){
            return -this.height;
        } 
        // down
        else if (this.quadrant == 3){
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
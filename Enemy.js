var Enemy = function(){
    this.speed = 2;
    this.color = "white"
    this.health = this.color.length - 1;
    this.width = CELLSIZE;
    this.height = CELLSIZE;
    this.getStart = ()=>{
        let quadrant = parseInt(Math.random()*4);
        let randWidth = Math.random()*canvas.width;
        let randHeight = Math.random()*canvas.height;
        switch (quadrant){
            // left
            case 0:
                this.x = -this.width;
                this.y = randHeight;
                // console.log(`left ${this.x}, ${this.y}`);
                break;
            // right
            case 1:
                this.x = canvas.width + this.width;
                this.y = randHeight;
                // console.log(`right ${this.x}, ${this.y}`);
                break;
            //up
            case 2: 
                this.x = randWidth;
                this.y = -this.height;
                // console.log(`up ${this.x}, ${this.y}`);
                break;
            // down
            case 3:
                this.x = randWidth;
                this.y = canvas.height + this.height;
                // console.log(`down ${this.x}, ${this.y}`);
                break;
        }
    }
    this.getDirection = ()=>{
        let width = char.x - this.x;
        let height = char.y - this.y;
        let theta = Math.atan(abs(height/width));
        this.vx = width/abs(width) * this.speed * cos(theta);
        this.vy = height/abs(height) * this.speed * sin(theta);
    }
    this.update = ()=>{
        ctx.fillStyle = this.color[this.health];
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.getDirection();
        this.x += this.vx;
        this.y += this.vy;
    }
    this.getStart();
}
export var Character = function() {
    this.width = CELLSIZE;
    this.height = CELLSIZE;
    this.baseColor = rgba(255,255,255,0.7);
    this.colors = ["#ff0000", "orange", "yellow"];
    this.accel = CELLSIZE/10;
    this.drag = 0.95;
    this.reloadBomb = 30; 
    this.timeToBomb = this.reloadBomb;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.currExplosion = undefined;
    this.reset = () => {
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height) / 2;
        this.health = this.colors.length
    }
    this.reset();
    this.keepInside = () => {
        if (this.x < 0){
            this.x = 0;
            this.vx = 0;
            this.ax = 0;
        } else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
            this.vx = 0;
            this.ax = 0;
        } else if (this.y < 0) { 
            this.y = 0;
            this.vy = 0;
            this.ay = 0;
        } else if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.vy = 0;
            this.ay = 0;
        }
    }
    this.takeDamage = () => {
        this.health -= 1;
        this.color = this.colors[this.health - 1];
        this.timeToBomb = 0;
        this.bomb();
    }
    this.bomb = () => {
        if (this.timeToBomb <= 0){
            let speedBonus = (max(abs(this.vx),abs(this.vy)))/CELLSIZE
            let bombSize = CELLSIZE*8*speedBonus;
            let bombColor = changeColorAlpha(this.color, 0.4)
            this.currExplosion = new Explosion(this, this.width, bombSize, bombColor);
            
            this.timeToBomb = this.reloadBomb;
        }
    }
    this.update = () => {
        this.color = this.colors[this.health-1]
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        this.centerX = this.x + this.width/2;
        this.centerY = this.y + this.height/2;
        this.keepInside();
        
        // draw explosions
        if (this.currExplosion != undefined) {
            this.currExplosion.update();
            if (this.currExplosion.done == true){
                this.currExplosion = undefined;
            }
        }    
        
        // draw halo (shows how ready the bomb is)
        let halo = CELLSIZE*1.5;
        let currHaloSize = halo * ( this.timeToBomb/this.reloadBomb)
        drawCircle(this.centerX, this.centerY, currHaloSize, rgba(255,255,255,0.6));
        
        ctx.fillStyle = this.baseColor;
        if (this.timeToBomb <= 0) {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.vx *= this.drag;
        this.vy *= this.drag;
        if (this.timeToBomb > 0) this.timeToBomb--;
    }
}
export var Explosion = function(obj, dist, maxSize, color){
    this.maxSize = maxSize;
    this.size = CELLSIZE;
    this.growRate = 1.5;
    this.done = false
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.update = function(){
        if (this.size < this.maxSize){
            this.size *= this.growRate;
            drawCircle(obj.x, obj.y, this.size, this.color);
            drawCircle(obj.x+dist, obj.y, this.size, this.color);
            drawCircle(obj.x, obj.y+dist, this.size, this.color);
            drawCircle(obj.x+dist, obj.y+dist, this.size, this.color);
            
            this.x = obj.x - this.size;
            this.y = obj.y - this.size;
            this.width = this.size*2+dist
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
var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');
const CELLSIZE = 10;
// keys
const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;
const UP_KEY = 38;
const DOWN_KEY = 40; 
const LEFT_KEY = 37;
const RIGHT_KEY = 39; 

const SPACE_KEY = 32;

// DIRECTIONS
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;

const MIN_ENEMY_SPAWN_TIME = 10
const START_ENEMY_SPAWN_TIME = MIN_ENEMY_SPAWN_TIME + 60
var ENEMY_SPAWN_TIME = undefined;
var timeSinceLastEnemy = 0;
var bullets = [];
var enemies = [];
var mouse = {
    clicked: false,
    x: undefined,
    y: undefined
}
var score = 0;
var time = undefined;
// Redefine common Math function
var abs  = (n)=>Math.abs(n);
var sqrt = (n)=>Math.sqrt(n);
var sin  = (n)=>Math.sin(n);
var cos  = (n)=>Math.cos(n);

// common functinos
var min = (x,y)=>(x < y ? x : y)
var max = (x,y)=>(x > y ? x : y)
var rgba = (r,g,b,a=1)=>(`rgba(${r},${g},${b},${a})`);
var isOnCanvas = (x,y)=>(x > 0 && x < canvas.width && y > 0 && y < canvas.height);
var getEpochTime = ()=>(new Date().getTime());
var drawCircle = (x,y,radius,color)=>{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*22);
    ctx.fill();
}
var bufferIntStr = (int)=>(int<10? "0"+int : ""+int);
var formatTime = (currSeconds)=>{
    let minutes = parseInt(currSeconds/60);
    let seconds = currSeconds - minutes*60;
    return bufferIntStr(minutes)+":"+bufferIntStr(seconds);
}
var hexToRgba = (hex, alpha=1)=>{
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return rgba(r,g,b,alpha);
}
var changeColorAlpha = (color, alpha)=>{
    let oldColor = ctx.fillStyle;
    ctx.fillStyle = color;
    let hex = ctx.fillStyle.substr(1)
    let result = hexToRgba(hex, alpha);
    ctx.fillStyle = oldColor;
    return result;
}

var update = (arr)=>(arr.map((elem)=>elem.update()))
var removeOffScreen = (arr)=>(arr.filter((elem)=>isOnCanvas(elem.x,elem.y)))
var collided = (a,b)=>{
    // makes collision be between the biggest bounding box of movement
    let xCollision = (max(a.x + a.width, a.x + a.width - a.vx) > min(b.x, b.x - b.vx) && 
                      min(a.x, a.x - a.vx) < max(b.x + b.width,b.x + b.width - b.vx));
    let yCollision = (max(a.y + a.height, a.y + a.height - a.vy) > min(b.y, b.y - b.vy) && 
                      min(a.y, a.y - a.vy) < max(b.y + b.height, b.y + b.height - b.vy));
    return xCollision && yCollision;
}

var displayText = (text,x,y,fontSize) => {
    ctx.font = fontSize + "px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign="center"; 
    ctx.fillText(text, x, y);
}

var Bullet = function(x, y, toX, toY) {
    this.width = CELLSIZE/3;
    this.height = this.width;
    this.color = "white";
    this.speed = 30;
    this.x = x;
    this.y = y;
    this.getDirection = () => {
        let width = toX - x;
        let height = toY - y;
        let theta = Math.atan(abs(height/width));
        this.vx = width/abs(width) * this.speed * cos(theta);
        this.vy = height/abs(height) * this.speed * sin(theta);
    }
    this.getDirection();
    bullets.push(this);
    this.update = () => {
        this.centreX = this.x - this.width/2;
        this.centreY = this.y - this.height/2;
        this.x += this.vx;
        this.y += this.vy;
        // for SQUARE
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.centreX, this.centreY, this.width, this.height); 
        
        // FOR CIRCLE
        drawCircle(this.x,this.y, this.width, this.color)
    }
}

var Enemy = function(){
    this.speed = 2;
    this.color = ["white"]//["red", "orange", "yellow"]
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

var Explosion = function(obj, dist, maxSize, color){
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

var Character = function() {
    this.width = CELLSIZE;
    this.height = CELLSIZE;
    this.baseColor = rgba(255,255,255,0.7);
    this.colors = ["#ff0000", "orange", "yellow"];
    this.accel = CELLSIZE/10;
    this.drag = 0.95;
    this.timeToFire = 0;
    this.reloadFire = 10; // constant number of frames to remove
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
    this.fire = () => {
        if (this.timeToFire <= 0){
            var b = new Bullet(this.centerX, this.centerY, mouse.x, mouse.y);
            this.timeToFire = this.reloadFire;
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
        // DEPRECATED FIRE COMMAND
        // if (mouse.clicked) {
            // this.fire();
        // }
        // if (this.timeToFire > 0) this.timeToFire--;
        if (this.timeToBomb > 0) this.timeToBomb--;
    }
}

function keyToggle(kc, result){    
    if (kc == W_KEY || kc == UP_KEY) UP = result;
    if (kc == S_KEY || kc == DOWN_KEY) DOWN = result;
    
    if (kc == A_KEY || kc == LEFT_KEY) LEFT = result;
    if (kc == D_KEY || kc == RIGHT_KEY) RIGHT = result;
}

function keyDownHandler(ev){
    var kc = ev.keyCode
    keyToggle(kc, true);
    
    if (UP)    char.ay = -char.accel;
    if (DOWN)  char.ay = char.accel;
    if (LEFT)  char.ax = -char.accel;
    if (RIGHT) char.ax = char.accel;
    
    if (kc == SPACE_KEY) char.bomb();
}

function keyUpHandler(ev){
    var kc = ev.keyCode
    keyToggle(kc, false)
    if (!UP && !DOWN)     char.ay = 0;
    if (!LEFT && !RIGHT)  char.ax = 0;
}

mouseDownHandler = (ev) => { 
    mouse.clicked = true;
    mouse.x = ev.x;
    mouse.y = ev.y;
}

mouseMoveHandler = (ev) => {
    mouse.x = ev.x;
    mouse.y = ev.y;
}

mouseUpHandler = (ev) => { 
    mouse.clicked = false;
    mouse.x = undefined;
    mouse.y = undefined;
}

function fillScreen(background){
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkCollisions(){
    enemies.map((e)=>{
        bullets.map((b)=>{
            if(collided(b, e)) e.health --;
        })
        
        if (char.currExplosion != undefined){            
            if(collided(char.currExplosion, e)) {
                e.health = -1;
            }
        }
        
        // if character and enemy collide
        if (collided(char, e)) {
            char.takeDamage();
            e.health = -1;
            fillScreen(char.color);
            if (char.health <= 0){
                startGame();
            }
        }
        bullets = bullets.filter((b)=>!collided(b,e))
    });
    
    let newEnemies = enemies.filter((e)=>e.health >= 0);
    score += enemies.length - newEnemies.length
    enemies = newEnemies;
}

function generateEnemies(){
    timeSinceLastEnemy ++;
    if (timeSinceLastEnemy > ENEMY_SPAWN_TIME){
        var enemy = new Enemy();
        enemies.push(enemy);
        timeSinceLastEnemy = 0;
    }
}

function loop(){
    fillScreen(rgba(0,0,0,0.1));
    let currSeconds = parseInt((getEpochTime() - time)/1000);
    
    displayText(formatTime(currSeconds),canvas.width/2, CELLSIZE*4, CELLSIZE*2);
    displayText(parseInt(ENEMY_SPAWN_TIME),canvas.width/2, canvas.height-CELLSIZE, CELLSIZE*2);
    generateEnemies();
    update(bullets);
    bullets = removeOffScreen(bullets);
    update(enemies);
    char.update();
    checkCollisions();
    ENEMY_SPAWN_TIME *= 0.9999;
}

// Start new game
var startGame = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    fillScreen("black");
    ENEMY_SPAWN_TIME = START_ENEMY_SPAWN_TIME;
    enemies = [];
    bullets = [];
    score = 0;
    char.reset()
    
    time = getEpochTime();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousedown", mouseDownHandler)
document.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener("mouseup", mouseUpHandler)

var char = new Character();
startGame()
setInterval(loop,20);


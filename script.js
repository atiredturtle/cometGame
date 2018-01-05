var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

// CONSTANTS
const MIN_ENEMY_SPAWN_TIME = 10
const START_ENEMY_SPAWN_TIME = MIN_ENEMY_SPAWN_TIME + 60
const CELLSIZE = 10;

// GLOBALS
var ENEMY_SPAWN_TIME = undefined;
var timeSinceLastEnemy = undefined;
var bullets = undefined;
var enemies = undefined;
var score = undefined;
var time = undefined;

// DIRECTIONS
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;

// Redefine common Math function
var abs  = (n)=>Math.abs(n);
var sqrt = (n)=>Math.sqrt(n);
var sin  = (n)=>Math.sin(n);
var cos  = (n)=>Math.cos(n);

// common functions
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
        var enemy = new Enemy(canvas);
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

var startGame = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    fillScreen("black");
    ENEMY_SPAWN_TIME = START_ENEMY_SPAWN_TIME;
    timeSinceLastEnemy = 0;
    enemies = [];
    bullets = [];
    score = 0;
    char.reset()
    
    time = getEpochTime();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

var char = new Character();
startGame()
setInterval(loop,20);


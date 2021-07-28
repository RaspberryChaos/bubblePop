// Canvas Setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "40px Georgia";
let gameSpeed = 1;
let gameOver = false;

let canvasPosition = canvas.getBoundingClientRect();
const replayBtn = document.getElementById("replay");
// Mouse Interactivity

let mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
};

canvas.addEventListener("mousedown", function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener("mouseup", function() {
    mouse.click = false;
});

replayBtn.addEventListener("click", () => {
    restart();
})

// Player

const playerLeft = new Image();
playerLeft.src = 'fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'fish_swim_right.png';

class Player {
    constructor() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 20;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if(mouse.x !== this.x) {
            this.x -= dx/20;
        };
        if(mouse.y !== this.y) {
            this.y -= dy/20;
        };

        if(gameFrame % 10 === 0) {
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if(this.frame === 3 || this.frame === 7 || this.frame === 11) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            this.frameY =  this.frame < 3 ? 0 :
            this.frame < 7 ? 1 :
            this.frame < 11 ? 2 : 0;
        }
    }

    draw() {
     /*   if(mouse.click) {
            ctx.linewidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y,this.radius,10);*/
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage((this.x >= mouse.x ? playerLeft : playerRight), this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 -60, 0 -45, this.spriteWidth/4, this.spriteHeight/4)
        ctx.restore();
    }
}

const player = new Player();

// Bubbles

let bubblesArray = [];

const bubbleImage = new Image();
bubbleImage.src = "bubble_pop_frame_01.png";

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }

    draw() {
        /*ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();*/
        ctx.drawImage(bubbleImage, this.x-65, this.y-65, this.radius*2.6, this.radius*2.6);
    }
}

const bubblePop1 = document.createElement("audio");
bubblePop1.src = "pop1.ogg";
const bubblePop2 = document.createElement("audio");
bubblePop2.src = "pop2.ogg";

function handleBubbles() {
    if(gameFrame % 50 === 0) {
        bubblesArray.push(new Bubble());
    }

    for(let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if(bubblesArray[i].y < 0 - this.radius*2) {
            bubblesArray.splice(i,1);
            i--;
        } else if(bubblesArray[i]) {
            if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
                if(!bubblesArray[i].counted) {
                    if(bubblesArray[i].sound === "sound1") {
                        bubblePop1.play();
                    } else {
                        bubblePop2.play();
                    }
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i,1);
                    i--;
                }
            }
        }
    }
}

//Repeating backgrounds

const background = new Image();
background.src = 'background1.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground() {
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

//Enemies

const enemyImage = new Image();
enemyImage.src = "enemy1.png"

class Enemy {
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height -150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }

    draw() {
       /* ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();*/
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x -60, this.y-70, this.spriteWidth/3, this.spriteHeight/3)
    }
    update() {
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height -150) + 90;
            this.speed = Math.random() * 2 + 2;
        }

        if(gameFrame % 10 === 0) {
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if(this.frame === 3 || this.frame === 7 || this.frame === 11) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            this.frameY =  this.frame < 3 ? 0 :
            this.frame < 7 ? 1 :
            this.frame < 11 ? 2 : 0;
        }

        // Collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
}

const enemy1 = new Enemy();

function handleEnemies() {
    enemy1.draw();
    enemy1.update();
}

// Game Over

function handleGameOver() {
    ctx.fillStyle = "white";
    ctx.fillText(`GAME OVER, you reached score ${score}`, 110, 250);
    gameOver = true;
    replayBtn.classList.remove("hidden");
}

// Play Again
function restart() {
    score = 0;
    gameFrame = 0;
    gameSpeed = 1;
    gameOver = false;
    bubblesArray = [];
    enemy1.x = canvas.width + 200;
    animate();
    replayBtn.classList.add("hidden");
}


// Animation Loop

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", function() {
    canvasPosition = canvas.getBoundingClientRect();
})

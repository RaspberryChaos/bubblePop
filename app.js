// Canvas Setup

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Georgia";

let canvasPosition = canvas.getBoundingClientRect();

let mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
};

canvas.addEventListener("mousedown", function(event){
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})



// Mouse Interactivity
// Player
// Bubbles
// Animation Loop

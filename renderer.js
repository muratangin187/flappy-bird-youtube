const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.font = '40px Times New Roman';

const IMAGES = {
  "bg": "bg.png",
  "pipe": "pipe.png",
  "pipe2": "pipe2.png",
  "bird": "bird.png",
  "bird-down": "bird-down.png",
  "bird-up": "bird-up.png",
  "gameover": "gameover.png",
  "message": "message.png",
};

let time = 0;
const pipes = generatePipes(); // general pipe locations

const birdW = 34;
const birdH = 24;
const birdX = 50 - birdH/2;
let birdY = 256 - birdW/2;
let vel = 0;
let acc = -9.8;
let died = false;
let start = false;

window.addEventListener('keydown', (e) => {
  if(e.keyCode === 32){
    e.preventDefault();
    if(!start){
      start = true;
      requestAnimationFrame(render);
    }else vel = 4;
  }
});



function generatePipes(){
  const arr = [];
  const gap = 180;
  const pipeCount = 100;
  for (let i = 1; i < pipeCount; i++) {
    const empty = Math.random()*270+100; // detect where can bird fly, the empty spot between pipes
    const size = Math.random()*100+100; // empty spot size
    arr.push([
      {x: i*gap, y: empty+size/2},
      {x: i*gap, y:empty-size/2-320}, // 320 is the pipe height
    ]);
  }
  return arr;
}

// We need to iterate over this dictionary to load all the images.
function loadImages(){
  let i = 0;
  const total = Object.values(IMAGES).length;
  Object.keys(IMAGES).forEach((key) => {
    let img = new Image();
    img.addEventListener('load', () => {
      i++;
      if(i === total) requestAnimationFrame(render) // start the game loop
    });
    img.src = 'sprites/' + IMAGES[key];
    IMAGES[key] = img;
  });
}

function render(){
  checkDie();
  if(!start){
    console.log("in start");
    ctx.drawImage(IMAGES['bg'], 0, 0);
    ctx.drawImage(IMAGES['message'], 55, 120);
  }else if(died){
    console.log("in die");
    resetGame();
  }else{
    console.log("in game");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(IMAGES['bg'], 0, 0);
    drawPipes();
    drawBird();
    drawScore();
    time += 0.5;
    requestAnimationFrame(render);
  }
}

function resetGame(){
  ctx.drawImage(IMAGES['gameover'], 50, 210);
  setTimeout(()=>{
    time = 0;
    birdY = 256 - birdW/2;
    vel = 0;
    acc = -9.8;
    died = false;
    start = false;
    requestAnimationFrame(render);
  }, 2000);

}

function checkDie(){
  let search = pipes
    .find(a =>
      a[0].x-time < birdX+birdW
      && a[0].x-time > birdX-52 // pipe width
      && (a[0].y < birdY+birdH || a[1].y+320 > birdY)
  );
  if(search) died = true;
}

function drawScore(){
  ctx.fillStyle = 'white';
  ctx.fillText("Score: " + parseInt(time/180), 10, 50); // 180 is the time needed to pass a pipe
  ctx.fillStyle = 'black';
}

function drawBird(){
  vel = vel + acc/80; // divide acceleration to a constant to  match a playable speed
  birdY = birdY - vel;
  if(vel > 1) ctx.drawImage(IMAGES['bird-up'], birdX, birdY);
  else if(vel < -1) ctx.drawImage(IMAGES['bird-down'], birdX, birdY);
  else ctx.drawImage(IMAGES['bird'], birdX, birdY);
}

function drawPipes(){
  // draw pipes visible to screen
  pipes.filter(pipe => pipe[0].x-time > -50 && pipe[0].x-time < 300).forEach(pipe => {
    ctx.drawImage(IMAGES['pipe'], pipe[0].x-time, pipe[0].y);
    ctx.drawImage(IMAGES['pipe2'], pipe[1].x-time, pipe[1].y);
  });
}

loadImages();


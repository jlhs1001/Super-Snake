let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let score = 0;

let apple = null;
let player = null;

let speedIncrement = 1.15;

let playerSegments = [];

function spawnPlayer(parent=null){


    player = {
      parent: parent,
      x: 50,
      y: 50,
      width: 32,
      height: 32,
      speed: 1,
      isCollided: function() {
        if (apple !== null) {
          return (
            this.x < apple.x + apple.width &&
            this.x + this.width > apple.x &&
            this.y < apple.y + apple.height &&
            this.y + this.height > apple.y
          );
        }
      }
    };
    if (parent) {
        player.x = parent.x;
        player.y = parent.y;
        player.speed = parent.speed;
      playerSegments.push(parent);
    }
    

}



let direction;

canvas.width = 1280;
canvas.height = 720;

function spawnApple() {
    apple = {
        "x": Math.floor(Math.random() * canvas.width),
        "y": Math.floor(Math.random() * canvas.height),
        "width": 32,
        "height": 32
    };
    ctx.fillStyle = "rgb(255,42,46)";
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
    console.log(apple);
}


document.addEventListener("keydown", function (e) {
    switch (e.code) {
        case "KeyW":
            direction = 1;
            break;
        case "KeyS":
            direction = 2;
            break;
        case "KeyA":
            direction = 3;
            break;
        case "KeyD":
            direction = 4;
            break;

        // For development only
        case "KeyL":
            player.speed *= 2;
            break;
        case "KeyK":
            player.speed *= .5;
            break;
    }

});

function update(progress) {
    if (player && player.isCollided()) {
        spawnApple();
        spawnPlayer(parent=player);
        player.speed *= speedIncrement;
        score++;
        console.log(score);
    }
    switch (direction) {
        case 1:
            player.y += -1 * player.speed;
            break;
        case 2:
            player.y += player.speed;
            break;
        case 3:
            player.x += -1 * player.speed;
            break;
        case 4:
            player.x += player.speed;
            break;
    }
    // console.log(`playerX: ${player.x} playerY: ${player.y}`);
}

function draw() {
    // Player
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(59,255,119)";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(score.toString(), canvas.width / 2 - 50, 30);

    ctx.fillText(`speed: ${player.speed.toFixed(2)}`, canvas.width / 2 + 15, 30)


    for(const p of playerSegments){
        ctx.fillRect(player.x -50, player.y -50, 32, 32);

    }
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    if (player === null) {
        spawnPlayer();
    }    
    if (apple === null) {
        spawnApple();
    }
    draw();


    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}

let lastRender = 0;
window.requestAnimationFrame(loop);
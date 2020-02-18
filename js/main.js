let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
let score = 0;
let dx = 32;

let gameState = true;

let apple = null;
let player = null;
let snake = [
    {x: 32, y: 256},
    {x: 64, y: 256},
    {x: 96, y: 256},
    {x: 128, y: 256},
    {x: 160, y: 256}
];

let head = {x: snake[0].x + dx, y: snake[0].y};

function drawSnakePart(snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokestyle = "darkgreen";

    ctx.fillRect(snakePart.x, snakePart.y, 32, 32);
    ctx.strokeRect(snakePart.x, snakePart.y, 32, 32);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    snake.unshift(head);
    snake.pop();
}

let lives = 3;

let speedIncrement = 1.15;


function spawnPlayer(parent = null) {
    player = {
        parent: parent,
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        speed: 1,
        isCollided: function () {
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
    }
}

let direction;

function spawnApple() {
    apple = {
        x: Math.floor(Math.random() * canvas.width - 32),
        y: Math.floor(Math.random() * canvas.height - 32),
        width: 32,
        height: 32
    };
    if (apple.x < apple.width) {
        apple.x += apple.width;
    } else if (apple.y < apple.width) {
        apple.y += apple.height;
    }
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
            player.speed *= 0.5;
            break;
    }
});


function update(progress) {
    advanceSnake();
    if (
        player &&
        (player.x > canvas.width ||
            player.x < 0 ||
            player.y > canvas.height ||
            player.y < 0)
    ) {
        spawnPlayer();
        lives--;

    }

    if (player && player.isCollided()) {
        spawnApple();
        spawnPlayer((parent = player));
        player.speed *= speedIncrement;
        score++;
        console.log(score);
    }
    switch (direction) {
        case 1:
            head = {x: snake[0].x, y: snake[0].y - dx};
            break;
        case 2:
            head = {x: snake[0].x, y: snake[0].y + dx};
            break;
        case 3:
            head = {x: snake[0].x - dx, y: snake[0].y};
            break;
        case 4:
            head = {x: snake[0].x + dx, y: snake[0].y};
            break;
    }

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    ctx.fillStyle = "rgb(59,255,119)";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(`score: ${score.toString()}`, canvas.width / 2 - 300, 30);
    ctx.fillText(`speed: ${player.speed.toFixed(2)}`, canvas.width / 2 - 170, 30);
    ctx.fillText(`Life: ${lives}`, canvas.width / 2 + 15, 30);

    if (lives <= 0) {
        console.log("Health Less Than Zero, You Died.");
        score = 0;
        lives = 3;
    }
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    if (gameState === true) {
        update(progress);
    }

    if (player === null) {
        spawnPlayer();
    }
    if (apple === null) {
        spawnApple();
    }

    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

let lastRender = 0;
window.requestAnimationFrame(loop);

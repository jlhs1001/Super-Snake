let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
let score = 0;
let dx = 32;

let gameState = true;

let apple = spawnApple();
let player = spawnPlayer();

let head = {x: player.snake[0].x, y: player.snake[0].y};

function drawSnakePart(snakePart) {
    ctx.fillStyle = "lightgreen";
    ctx.strokestyle = "darkgreen";

    ctx.fillRect(snakePart.x, snakePart.y, 32, 32);
    ctx.strokeRect(snakePart.x, snakePart.y, 32, 32);
}

function drawSnake() {
    player.snake.forEach(drawSnakePart);
}

function advanceSnake() {
    player.snake.unshift(head);
    player.snake.pop();
}

let lives = 3;
let speedIncrement = 1.15;


function spawnPlayer() {
    return {
        snake: [
            {x: 32, y: 256},
            {x: 64, y: 256},
            {x: 96, y: 256},
            {x: 128, y: 256},
            {x: 160, y: 256}
        ],
        speed: 1,
        appendToSnake: function () {
            if(this.snake[-1] === null){return}

            let x = this.snake[0].x + (32 * this.snake.length);
            let y = this.snake[0].y + (32 * this.snake.length);
            this.snake.push({x: x, y: y})
        },
        isCollided: function () {
            result = false;
            if (apple === null) {
                return false;
            }

            this.snake.forEach(function (s) {
                if (
                    s.x < apple.x + apple.width &&
                    s.x + 32 > apple.x &&
                    s.y < apple.y + apple.height &&
                    s.y + 32 > apple.y
                ) {
                    result = true;
                }
            })
            return result;
        }
    }
}

let direction;

function spawnApple() {
    return {
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
        (player.snake[0].x > canvas.width ||
            player.snake[0].x < 0 ||
            player.snake[0].y > canvas.height ||
            player.snake[0].y < 0)
    ) {
        spawnPlayer();
        lives--;
    }

    if (player && player.isCollided()) {

        apple = spawnApple();
        player = spawnPlayer();
        player.speed *= speedIncrement;
        score++;
        player.appendToSnake();
        console.log(score);
    }
    head = {x: player.snake[0].x, y: player.snake[0].y};
    switch (direction) {
        case 1:
            head.y -= dx * player.speed;
            break;
        case 2:
            head.y += dx * player.speed;
            break;
        case 3:
            head.x -= dx * player.speed;
            break;
        case 4:
            head.x += dx * player.speed;
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
        player = spawnPlayer();
    }
    if (apple === null) {
        apple = spawnApple();
    }

    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

let lastRender = 0;
window.requestAnimationFrame(loop);

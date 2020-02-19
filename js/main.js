let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 640;
let score = 0;
let dx = 32;

let autoSnake = false;

const grid_intervals = [0, 32, 64, 96, 128, 160, 192,
    224, 256, 288, 320, 352, 384, 416, 448, 480, 512,
    544, 576, 608, 640, 672, 704, 736, 768, 800, 832,
    864, 896, 928, 960, 992, 1024, 1056, 1088, 1120];

function toNearestGridInterval(n) {
    if (n !== grid_intervals) {
        n--
    }


    return n;
}

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
        speed: 0.2,
        appendToSnake: function () {

            let x = this.snake[0].x + (32 * this.snake.length);
            let y = this.snake[0].y + (32 * this.snake.length);
            this.snake.push({x: x, y: y})
        },
        isCollided: function () {
            let result = false;
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
            });
            return result;
        },
        autoSnake: function () {
            let result = 0;

            if (head.x === apple.x) {
                if (head.y < apple.y) {
                    console.log('y1', head.x, apple.x);

                    result = 3;
                } else if (head.y > apple.y) {
                    console.log('y2', head.x, apple.x);

                    result = 4;
                }
            }

            if (head.x < apple.x) {
                console.log('x1', head.x, apple.x);
                result = 1;
            } else if (head.x > apple.x) {
                console.log('x2', head.x, apple.x);
                result = 2
            }

            // } else if (head.y < apple.y) {
            //     console.log("Y-1");
            //     result = 3;
            // } else if (head.y > apple.y) {
            //     console.log("Y-2");
            //     result = 4;
            // }

            return result;

        }
    }
}

let direction;

function spawnApple() {
    let x = toNearestGridInterval(Math.floor(Math.random() * canvas.width));
    let y = toNearestGridInterval(Math.floor(Math.random() * canvas.width));

    return {
        x: x,
        y: y,
        width: 32,
        height: 32
    };
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

        // increase/decrease speed
        case "KeyL":
            player.speed *= 2;
            break;
        case "KeyK":
            player.speed *= 0.5;
            break;

        // increase/decrease snake length
        case "KeyI":
            player.appendToSnake();
            break;
        case "KeyO":
            player.snake.pop();
            break;
        // activates auto snake movement algorithm
        case "KeyU":
            autoSnake = true;
    }
    if (player.speed !== 0) {
        if (e.code === "KeyP")
            player.speed *= 0;
    } else if (player.speed === 0) {
        player.speed += 0.5;
    }

});

// console.log(player.autoSnake());

function update(progress) {
    advanceSnake();
    if (autoSnake === true) {
        if (player.autoSnake() === 1) {
            head.x += dx;
        } else if (player.autoSnake() === 2) {
            head.x -= dx;
        } else if (player.autoSnake() === 3) {
            head.y += dx;
        } else if (player.autoSnake() === 4) {
            head.y -= dx;
        }
    }

    if (
        player &&
        (player.snake[0].x > canvas.width - player ||
            player.snake[0].x < 0 ||
            player.snake[0].y > canvas.height ||
            player.snake[0].y < 0)
    ) {
        spawnPlayer();
        lives--;

    }


    if (player && player.isCollided()) {
        // Spawns new apple after collision
        apple = spawnApple();


        // player.speed *= speedIncrement;

        // score implementation
        score++;
        // console.log(score);

        player.appendToSnake();
        // console.log(`Snake Length: ${player.snake.length}`)
    }

    head = {x: player.snake[0].x, y: player.snake[0].y};

    switch (direction) {
        case 1:
            head.y -= dx;
            break;
        case 2:
            head.y += dx;
            break;
        case 3:
            head.x -= dx;
            break;
        case 4:
            head.x += dx;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Health Less Than Zero, You Died.");
        score = 0;
        lives = 3;
        gameState = false;
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

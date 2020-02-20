// TODO: make the pos X/Y round to nearest

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 640;
let score = 0;
let dx = 32;
let speed = 1;

let developerMode = false;

let directionState;

let autoSnake = false;

const grid_intervalsX = [0, 32, 64, 96, 128, 160, 192,
    224, 256, 288, 320, 352, 384, 416, 448, 480, 512,
    544, 576, 608, 640, 672, 704, 736, 768];

const grid_intervalsY = [0, 32, 64, 96, 128, 160, 192,
    224, 256, 288, 320, 352, 384, 416, 448, 480, 512,
    544, 576, 608];

// function toNearestGridInterval(n) {
//     if (n !== grid_intervals) {
//         n--
//     }
//
//
//     return n;
// }

function ranArrayItem(arrayName) {
    let i = (Math.floor(Math.random() * arrayName.length));
    return arrayName[i]
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

function snakeSelfCollision() {
    for (let i = 0; i < player.snake.length; i++) {
        try {
            if (head.x === player.snake[i + 1].x && head.y === player.snake[i + 1].y) {
                return true
            }
        }
        catch (e) {
            return false
        }
    }
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

            let x = this.snake[0].x + (32);
            let y = this.snake[0].y + (32);
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
                    result = 3;
                } else if (head.y > apple.y) {
                    result = 4;
                }
            }
            if (head.x < apple.x) {
                result = 1;
            } else if (head.x > apple.x) {
                result = 2
            }

            return result;

        }
    }
}

function wallIsCollided() {
    if (
        player &&
        (player.snake[0].x > canvas.width - (dx / 2) ||
            player.snake[0].x < 0 ||
            player.snake[0].y > canvas.height - (dx / 2) ||
            player.snake[0].y < 0)
    ) {
        return true
    }
}

let direction;

function spawnApple() {
    let x = (ranArrayItem(grid_intervalsX));
    let y = (ranArrayItem(grid_intervalsY));

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
        case "ArrowUp":
            direction = 1;
            break;
        case "KeyS":
            direction = 2;
            break;
        case "ArrowDown":
            direction = 2;
            break;
        case "KeyA":
            direction = 3;
            break;
        case "ArrowLeft":
            direction = 3;
            break;
        case "KeyD":
            direction = 4;
            break;
        case "ArrowRight":
            direction = 4;
            break;
        // For development only

        // increase/decrease speed
        case "KeyL":
            // increases speed
            tick += 1;
            break;
        case "KeyK":
            // decreases speed
            tick -= 1;
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
            break;
        // activate developer mode
        case "KeyJ":
            developerMode = true;
            break;
    }
    if (dx !== 0) {
        if (e.code === "KeyP")
            dx *= 0;
    } else if (dx === 0) {
        dx += 32;
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

    if (snakeSelfCollision() === true) {

        console.log(snakeSelfCollision())
    }

    if (developerMode === false) {
        if (wallIsCollided() === true) {
            score--;
            gameState = false;
        }
    } else if (developerMode === true) {
        if (player && head.x > canvas.width) {
            head.x = 0;
        } else if (player && head.x < 0) {
            head.x = canvas.width
        }

        if (player &&  head.y > canvas.height) {
            head.y = 0
        } else if (player && head.y < 0) {
            head.y = canvas.height
        }
    }

    if (player && player.isCollided()) {
        // Spawns new apple after collision
        apple = spawnApple();
        if (apple.x > 800) {
        } else if (apple.y > 640) {
        }


        // player.speed *= speedIncrement;

        // score implementation
        score++;
        // console.log(score);

        player.appendToSnake();
        // console.log(`Snake Length: ${player.snake.length}`)
    }

    head = {x: player.snake[0].x, y: player.snake[0].y};

    if (direction === 1) {
        if (directionState !== "down") {
            head.y -= dx;
            directionState = "up"
        }
    } else if (direction === 2) {
        if (directionState !== "up") {
            head.y += dx;
            directionState = "down"
        }
    } else if (direction === 3) {
        if (directionState !== "right") {
            head.x -= dx;
            directionState = "left"
        }
    } else if (direction === 4) {
        if (directionState !== "left") {
            head.x += dx;
            directionState = "right"
        }
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
    ctx.fillText(`speed: ${tick}`, canvas.width / 2 - 170, 30);
    ctx.fillText(`Life: ${lives}`, canvas.width / 2 + 15, 30);

    if (lives <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Health Less Than Zero, You Died.");
        score = 0;
        lives = 3;
        gameState = false;
    }
}

let tick = 5;
let updateTick = 0;

function loop(timestamp) {
    let progress = timestamp - lastRender;
    if (gameState === true) {

        if (updateTick === tick) {
            update(progress);
            updateTick = 0;
        }
    }
    updateTick++;


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

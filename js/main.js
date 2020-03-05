let leaderBoard = document.getElementById("leaderBoard");
let gameOverButton = document.getElementById("gameOverButton");
let gameOverBox = document.getElementById("gameOver");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
console.log(canvas.style.backgroundPositionX);
canvas.width = 816;
canvas.height = 624;



let invincibleMode = false;
let hState = false;
colors = ["red", "green", "orange", "blue", "yellow", "pink", "purple"];

let snakeBreak = false;

leaderBoard.style.backgroundPositionX = canvas.style.backgroundPositionX;

function moveSnake(ifX, ifY, toX, toY) {
    if (head.x === ifX) {
        head.x = toX
    } else if (head.y === ifY) {
        head.y = toY
    }
}

let score = null;
const gridSize = 24;
let developerMode,
    highScore,
    pushScore,
    autoSnake,
    gameState,
    apple,
    player;

const grid_intervalsX = [];

const grid_intervalsY = [];

[...Array(25).keys()].map(function (i) {
    grid_intervalsX.push(gridSize * i);
    grid_intervalsY.push(gridSize * i);
});
console.log(grid_intervalsX, grid_intervalsY);

function ranArrayItem(arrayName) {
    let i = (Math.floor(Math.random() * arrayName.length));
    return arrayName[i]
}

let direction;

function gameOver() {
    direction = null;
    gameOverBox.style.display = "block";
    gameOverButton.onclick = function () {

        head.x = gridSize;
        head.y = gridSize * 8;
        newGame()
    };
    pushScore = true;
}

function newGame() {
    player = null;
    gameOverBox.style.display = "none";

    developerMode = false;
    autoSnake = false;

    apple = spawnApple();
    player = spawnPlayer();
    score = 0;
    gameState = true;

}

newGame();

let head = {x: player.snake[0].x, y: player.snake[0].y};

function teleportSnake() {
    if (player && head.x > canvas.width) {
        head.x = 0;
    } else if (player && head.x < 0) {
        head.x = canvas.width
    }
    if (player && head.y > canvas.height) {
        head.y = 0
    } else if (player && head.y < 0) {
        head.y = canvas.height
    }
}

function drawSnakePart(snakePart) {
    if (invincibleMode === false) {
        ctx.fillStyle = "lightgreen";
    } else {
        ctx.fillStyle = ranArrayItem(colors);
    }

    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function snakeSelfCollision() {
    for (let i = 0; i < player.snake.length; i++) {
        try {
            if (head.x === player.snake[i + 1].x && head.y === player.snake[i + 1].y) {
                if (developerMode === false) {
                    return true
                }
            }
        } catch (e) {
            return false
        }
    }
}

function drawSnake() {
    player.snake.forEach(drawSnakePart);
}

function advanceSnake() {

    player.snake.pop();
    player.snake.unshift(head);
}

function spawnPlayer() {
    return {
        snake: [
            {x: gridSize, y: gridSize * 6},
        ],

        speed: 0.2,
        appendToSnake: function () {
            let x = this.snake[0].x;
            let y = this.snake[0].y;

            this.snake.push({x: x, y: y});
        },
        isCollided: function () {
            let result = false;
            if (apple === null) {
                return false;
            }

            this.snake.forEach(function (s) {
                if (
                    s.x < apple.x + apple.width &&
                    s.x + gridSize > apple.x &&
                    s.y < apple.y + apple.height &&
                    s.y + gridSize > apple.y
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
        (player.snake[0].x > canvas.width - (gridSize / 2) || player.snake[0].x < 0 ||
            player.snake[0].y > canvas.height - (gridSize / 2) || player.snake[0].y < 0)
    ) {
        return true
    }
}

function spawnApple() {
    let x = (ranArrayItem(grid_intervalsX));
    let y = (ranArrayItem(grid_intervalsY));

    return {
        x: x,
        y: y,
        width: gridSize,
        height: gridSize
    };
}

document.addEventListener("keydown", function (e) {
    switch (e.code) {
        case "KeyW":
            autoSnake = false;
            direction = 1;
            break;
        case "ArrowUp":
            autoSnake = false;
            direction = 1;
            break;
        case "KeyS":
            autoSnake = false;
            direction = 2;
            break;
        case "ArrowDown":
            autoSnake = false;
            direction = 2;
            break;
        case "KeyA":
            autoSnake = false;
            direction = 3;
            break;
        case "ArrowLeft":
            autoSnake = false;
            direction = 3;
            break;
        case "KeyD":
            autoSnake = false;
            direction = 4;
            break;
        case "ArrowRight":
            autoSnake = false;
            direction = 4;
            break;
        // For development only
        case "KeyL":
            tick += 1;
            break;
        case "KeyK":
            tick -= 1;
            break;

        case "KeyI":
            player.appendToSnake();
            break;
        case "KeyO":
            player.snake.pop();
            break;

        case "KeyU":
            autoSnake = true;
            break;
    }
    if (e.code === "KeyY") {
        hState = true;
    }
    if (hState === true) {
        if (e.code === "KeyH") {
            invincibleMode = true;
        }
    }

    if (developerMode === false) {
        if (e.code === "KeyJ") {
            developerMode = true;
        }
    } else if (developerMode === true) {
        if (e.code === "KeyJ") {
            developerMode = false;
        }
    }

    if (gameState === false) {
        if (e.code === "KeyP")
            gameState = true;
    } else if (gameState === true) {
        if (e.code === "KeyP") {
            gameState = false;
        }
    }

});
highScore = 0;

function highestScore() {
    leaderBoard.innerHTML = `High Score: ${highScore} Score: ${score}`;
}

function update(progress) {
    highestScore();
    if (invincibleMode === true) {
        score++;
        pushScore = true;
        developerMode = true;
    }


    advanceSnake();
    if (autoSnake === true) {
        if (player.autoSnake() === 1) {
            head.x += gridSize;
        } else if (player.autoSnake() === 2) {
            head.x -= gridSize;
        } else if (player.autoSnake() === 3) {
            head.y += gridSize;
        } else if (player.autoSnake() === 4) {
            head.y -= gridSize;
        }
    }

    if (snakeSelfCollision() === true) {
        score = 0;
        console.log(snakeSelfCollision());
        gameOver()
    }

    if (developerMode === false) {
        if (wallIsCollided() === true) {
            gameOver();
            score = 0;
        }
    } else if (developerMode === true) {
        teleportSnake()
    }

    if (player && player.isCollided()) {
        apple = spawnApple();
        score++;
        player.appendToSnake();
        if (score >= highScore) {
            highScore = score;
        }
    }

    head = {x: player.snake[0].x, y: player.snake[0].y};

    if (direction !== 2 && direction === 1) {
        head.y -= gridSize;
    } else if (direction !== 1 && direction === 2) {
        head.y += gridSize;
    } else if (direction !== 4 && direction === 3) {
        head.x -= gridSize;
    } else if (direction !== 3 && direction === 4) {
        head.x += gridSize;

    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    ctx.fillStyle = "rgb(59,255,119)";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = "red";
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);
}

let tick = 4;
let updateTick = 0;

function loop(timestamp) {
    let progress = timestamp - lastRender;

    if (snakeBreak === false) {
        if (gameState === true) {
            if (updateTick >= tick) {
                update(progress);
                updateTick = 0;
            }
        }
    }
    updateTick++;
    if (player === null) {
        player = spawnPlayer();
    } else if (apple === null) {
        apple = spawnApple();
    }
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

let lastRender = 0;
window.requestAnimationFrame(loop);
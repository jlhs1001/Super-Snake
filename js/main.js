let leaderBoard = document.getElementById("leaderBoard");
let gameOverButton = document.getElementById("gameOverButton");
let gameOverBox = document.getElementById("gameOver");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameOverWrapper = document.getElementById("gameOverWrapper");

// sound
let secret = document.getElementById("secretSFX");
let cheer = document.getElementById("cheerSFX");
let beep = document.getElementById("beepSFX");
let die = document.getElementById("dieSFX");
// elite mode
let e1 = document.getElementById("e1");
let e2 = document.getElementById("e2");
let e3 = document.getElementById("e3");
let e4 = document.getElementById("e4");
let e5 = document.getElementById("e5");
let e6 = document.getElementById("e6");
let e7 = document.getElementById("e7");
let e8 = document.getElementById("e8");
let e9 = document.getElementById("e9");
let e10 = document.getElementById("e10");
//

let eliteStart = 0;

let img = document.getElementById("apple");

/////////////////////////////////////////////////////////////////
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultValue) {
    let urlparameter = defaultValue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

/////////////////////////////////////////////////////


let ranValueR;
let ranValueG;
let ranValueB;

let timerInt = 0;

canvas.width = 816;
canvas.height = 624;

let appleTimer = 0,
    appleTimerMode;

let easterEgg = false;

let invincibleMode = false;
let hState = false;

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
    player,
    lastDirection,
    powerUp;

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
    gameState = false;
    gameOverBox.style.display = "block";
    gameOverWrapper.style.display = "block";
    gameOverButton.onclick = function () {
        head.x = gridSize;
        head.y = gridSize * 8;
        newGame()
    };
    pushScore = true;
}

function newGame() {
    gameOverWrapper.style.display = "none";
    player = null;
    gameOverBox.style.display = "none";
    lastDirection = null;
    developerMode = false;
    autoSnake = false;

    apple = spawnApple();
    player = spawnPlayer();
    powerUp = spawnPowerUp();
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
        ctx.fillStyle = 'rgb(' + ranValueR + ',' + ranValueG + ',' + ranValueB + ')'
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

function spawnPowerUp() {
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
    beep.play();
    if (eliteStart === 0) {
        // e9.play();
        eliteStart++;
    }
    switch (e.code) {
        case "KeyW":
            window.location.href = "https://jlhs1001.github.io/Super-Snake/?player=elite";
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

    if (gameState === false) {
        if (e.code === "Escape") {
            head.x = gridSize;
            head.y = gridSize * 8;
            newGame()
        }
    }

    if (e.code === "KeyY") {
        hState = true;
    }
    if (hState === true) {
        if (e.code === "KeyH") {
            secret.play();
            easterEgg = true;
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
    if (getUrlParam("player", false) === "elite") {
        leaderBoard.innerHTML = `High Score: ${highScore} \xa0\xa0\xa0\ Score: ${score} \xa0\xa0\xa0\ ELITE MODE`;
    } else {
        leaderBoard.innerHTML = `High Score: ${highScore} \xa0\xa0\xa0\ Score: ${score}`;
    }
}

function update(progress) {
    highestScore();

    if (tick % 4 === 0) {
        ranValueR = Math.floor(Math.random() * 255);
        ranValueG = Math.floor(Math.random() * 255);
        ranValueB = Math.floor(Math.random() * 255);
    } else if (getUrlParam("player", false) === "beginner") {

    }


    if (easterEgg === false) {
        if (invincibleMode === true) {
            developerMode = true;
        }
        if (appleTimerMode === true) {

            if (appleTimer < 25) {
                appleTimer++;
                invincibleMode = true;
                developerMode = true;
            } else if (appleTimer > 25) {
                invincibleMode = false;
                appleTimerMode = false;
                appleTimer = 0;
                developerMode = false;
            }
        }

        if (appleTimerMode === true) {
            appleTimer++
        }
    } else if (easterEgg === true) {
        if (invincibleMode === true) {
            developerMode = true;
        }
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
            if (getUrlParam("player", false) === "elite") {
                e10.play();
            } else {
                die.play();
            }
        }
    } else if (developerMode === true) {
        teleportSnake()
    }

    if (player && player.isCollided()) {
        if (getUrlParam("player", false) === "elite") {
            switch (score) {
                case 0:
                    e1.play();
                    break;
                case 0.5:
                    e2.play();
                    break;
                case 1:
                    e3.play();
                    break;
                case 1.5:
                    e4.play();
                    break;
                case 2:
                    e5.play();
                    break;
                case 2.5:
                    e6.play();
                    break;
                case 3:
                    e7.play();
                    break;
                case 3.5:
                    e8.play();
                    break;
            }
            if (score >= 4) {
                e9.play();
            }
        } else {
            cheer.play();
        }
        apple = spawnApple();
        if (getUrlParam("player", false) === "elite") {
            score += 0.5;
        } else {
            score++;
        }
        appleTimerMode = true;
        player.appendToSnake();
        if (score >= highScore) {
            highScore = score;
        }
    }

    head = {x: player.snake[0].x, y: player.snake[0].y};

    if (direction === 1) {
        if (lastDirection === 2) {
            head.y += gridSize
        } else {
            head.y -= gridSize;
            lastDirection = 1;
        }

    } else if (direction === 2) {
        if (lastDirection === 1) {
            head.y -= gridSize
        } else {
            head.y += gridSize;
            lastDirection = 2;
        }
    } else if (direction === 3) {
        if (lastDirection === 4) {
            head.x += gridSize;
        } else {
            head.x -= gridSize;
            lastDirection = 3;
        }
    } else if (direction === 4) {
        if (lastDirection === 3) {
            head.x -= gridSize
        } else {
            head.x += gridSize;
            lastDirection = 4;
        }

    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    ctx.fillStyle = "rgb(59,255,119)";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.drawImage(img, apple.x, apple.y, apple.width, apple.height);

}

let tick = 4;
let updateTick = 0;

if (getUrlParam("player", false) === "beginner") {
    tick = 8;
} else if (getUrlParam("player", false) === "ELITE") {
    tick = 3;
}

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
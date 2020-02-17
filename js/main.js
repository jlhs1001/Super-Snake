let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let apple = null;

let player = {
    "x": 50, "y": 50, "width": 32, "height": 32, "speed": 1, "isCollided": function () {
        if (apple !== null) {
            return (this.x < apple.x + apple.width &&
                this.x + this.width > apple.x &&
                this.y < apple.y + apple.height &&
                this.y + this.height > apple.y)
        }
    }
};

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
    }
});

function update(progress) {
    if (player.isCollided()) {
        alert()
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
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height)
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    if (apple === null) {
        spawnApple();
    }
    draw();


    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}

let lastRender = 0;
window.requestAnimationFrame(loop);
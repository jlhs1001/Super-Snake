let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let player = {"x": 50, "y": 50, "width": 50, "height": 50, "speed": 1};

let direction;

canvas.width = 600;
canvas.height = 550;

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
    ctx.fillRect(player.x, player.y, player.width, player.height)
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}
let lastRender = 0;
window.requestAnimationFrame(loop);
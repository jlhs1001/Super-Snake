let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let player = {"x": 50, "y": 50, "width": 50, "height": 50};

function update(progress) {
    // Update the state of the world for the elapsed time since last render
}

function draw() {
    // Player
    ctx.fillStyle = "rgb(0, 255, 0)";
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
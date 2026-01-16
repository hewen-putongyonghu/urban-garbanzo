const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");

// 游戏对象定义
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;

let player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
let computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4 };

// 监听键盘
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") upPressed = true;
    if (e.key === "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") upPressed = false;
    if (e.key === "ArrowDown") downPressed = false;
});

// 监听鼠标
document.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - paddleHeight / 2;
});

// 绘制函数
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
}

// 重置球
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // 改变方向
}

// 更新游戏状态
function update() {
    // 键盘移动玩家
    if (upPressed && player.y > 0) player.y -= 7;
    if (downPressed && player.y < canvas.height - paddleHeight) player.y += 7;

    // 球移动
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 墙壁碰撞 (上下)
    if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
        ball.dy *= -1;
    }

    // 简单的 AI 逻辑
    let computerCenter = computer.y + paddleHeight / 2;
    if (computerCenter < ball.y - 35) computer.y += 4;
    else if (computerCenter > ball.y + 35) computer.y -= 4;

    // 球与挡板的碰撞检测
    let paddle = (ball.x < canvas.width / 2) ? player : computer;

    if (collision(ball, paddle)) {
        ball.dx *= -1.1; // 每次击中稍微加速
    }

    // 得分逻辑
    if (ball.x - ballSize < 0) {
        computer.score++;
        computerScoreElement.innerText = computer.score;
        resetBall();
    } else if (ball.x + ballSize > canvas.width) {
        player.score++;
        playerScoreElement.innerText = player.score;
        resetBall();
    }
}

// 碰撞检测函数
function collision(b, p) {
    return b.x < p.x + paddleWidth && b.x + ballSize > p.x &&
           b.y < p.y + paddleHeight && b.y + ballSize > p.y;
}

// 渲染
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000"); // 清除画布
    drawRect(player.x, player.y, paddleWidth, paddleHeight, "#fff"); // 玩家
    drawRect(computer.x, computer.y, paddleWidth, paddleHeight, "#fff"); // 电脑
    drawBall(ball.x, ball.y, ballSize, "#fff"); // 球
}

// 游戏循环
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

game();

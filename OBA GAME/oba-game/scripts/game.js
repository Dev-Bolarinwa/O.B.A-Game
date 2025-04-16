const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size dynamically based on screen size
function resizeCanvas() {
    if (window.innerWidth >= 1024) {
        canvas.width = 1000; // Larger canvas for desktop
        canvas.height = 500;
    } else {
        canvas.width = Math.min(window.innerWidth * 0.9, 800); // Max width 800px
        canvas.height = Math.min(window.innerHeight * 0.5, 400); // Max height 400px
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let playerX = canvas.width / 2 - 20;
let playerY = canvas.height - 30;
const playerWidth = 40;
const playerHeight = 10;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 3;
let ballSpeedY = 3;

let lives = 6;
let isPaused = false;

function drawPlayer() {
    ctx.fillStyle = '#4CAF50'; // Green color for the player
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5722'; // Orange color for the ball
    ctx.fill();
    ctx.closePath();
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Lives: ${lives}`, 10, 20);
}

function updateGame() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBall();
    drawLives();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with player
    if (
        ballY + ballRadius > playerY &&
        ballX > playerX &&
        ballX < playerX + playerWidth
    ) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball falls below the player
    if (ballY + ballRadius > canvas.height) {
        lives--;
        if (lives > 0) {
            // Reset ball position
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedY = -ballSpeedY;
        } else {
            alert('Game Over! You lost all your lives.');
            document.location.reload();
        }
    }
}

function movePlayer(event) {
    const key = event.key;
    if (key === 'ArrowLeft' && playerX > 0) {
        playerX -= 30; // Increased speed
    } else if (key === 'ArrowRight' && playerX < canvas.width - playerWidth) {
        playerX += 30; // Increased speed
    }
}

document.addEventListener('keydown', movePlayer);

function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

// Replay button functionality
document.getElementById('replayButton').addEventListener('click', () => {
    lives = 6;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 3;
    ballSpeedY = 3;
    isPaused = false;
});

// Pause button functionality
document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = !isPaused;
});

// Difficulty level buttons
document.getElementById('easyButton').addEventListener('click', () => {
    ballSpeedX = 2;
    ballSpeedY = 2;
});

document.getElementById('mediumButton').addEventListener('click', () => {
    ballSpeedX = 4;
    ballSpeedY = 4;
});

document.getElementById('hardButton').addEventListener('click', () => {
    ballSpeedX = 6;
    ballSpeedY = 6;
});

gameLoop();
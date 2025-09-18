const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let playerX = 180;
let score = 0;
let highScore = 0;
let gameOver = false;
let blockInterval, scoreInterval, speed = 5;

// 玩家左右移動
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 40;
  } else if (e.key === "ArrowRight" && playerX < 360) {
    playerX += 40;
  }
  player.style.left = playerX + "px";
});

// 生成不同顏色方塊
function createBlock() {
  if (gameOver) return;
  const block = document.createElement("div");
  block.classList.add("block");

  const rand = Math.random();
  if (rand < 0.6) {
    block.classList.add("red"); // 60% 紅色 (危險)
  } else if (rand < 0.85) {
    block.classList.add("green"); // 25% 綠色 (+10分)
  } else {
    block.classList.add("yellow"); // 15% 黃色 (-5分)
  }

  block.style.left = Math.floor(Math.random() * 10) * 40 + "px";
  block.style.top = "0px";
  gameArea.appendChild(block);
  moveBlock(block);
}

// 方塊下落 + 碰撞檢查
function moveBlock(block) {
  let blockInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(blockInterval);
      return;
    }

    let blockTop = parseInt(block.style.top);
    block.style.top = blockTop + speed + "px";

    // 碰撞範圍檢查
    let playerRect = player.getBoundingClientRect();
    let blockRect = block.getBoundingClientRect();

    if (
      blockRect.bottom > playerRect.top &&
      blockRect.top < playerRect.bottom &&
      blockRect.left < playerRect.right &&
      blockRect.right > playerRect.left
    ) {
      if (block.classList.contains("red")) {
        endGame();
      } else if (block.classList.contains("green")) {
        score += 10;
        updateScoreDisplay();
        block.remove();
        clearInterval(blockInterval);
      } else if (block.classList.contains("yellow")) {
        score = Math.max(0, score - 5);
        updateScoreDisplay();
        block.remove();
        clearInterval(blockInterval);
      }
    }

    // 超出畫面刪除
    if (blockTop > 600) {
      block.remove();
      clearInterval(blockInterval);
    }
  }, 30);
}

// 更新分數
function updateScore() {
  if (gameOver) return;
  score++;
  updateScoreDisplay();

  // 遊戲時間越久，下落速度增加
  if (score % 100 === 0) {
    speed++;
  }
}

function updateScoreDisplay() {
  scoreElement.textContent = "Score: " + score;
}

// 遊戲開始
function startGame() {
  resetGame();
  gameOver = false;
  speed = 5;
  scoreInterval = setInterval(updateScore, 100);
  blockInterval = setInterval(createBlock, 1000);
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
}

// 遊戲結束
function endGame() {
  gameOver = true;
  clearInterval(blockInterval);
  clearInterval(scoreInterval);

  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = "High Score: " + highScore;
  }

  alert("Game Over! Your score is: " + score);
  restartBtn.style.display = "inline-block";
}

// 重設遊戲
function resetGame() {
  playerX = 180;
  player.style.left = playerX + "px";
  score = 0;
  updateScoreDisplay();
  document.querySelectorAll(".block").forEach(b => b.remove());
}

// 綁定按鈕
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

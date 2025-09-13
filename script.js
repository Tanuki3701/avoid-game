const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let playerX = 180; // 玩家初始位置
let score = 0; // 當前分數
let highScore = 0; // 最高分紀錄
let gameOver = false; // 是否遊戲結束
let blockInterval, scoreInterval; // 計時器

// 玩家左右移動
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  } else if (e.key === "ArrowRight" && playerX < 360) {
    playerX += 20;
  }
  player.style.left = playerX + "px";
});

// 生成掉落方塊
function createBlock() {
  if (gameOver) return;
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.left = Math.floor(Math.random() * 10) * 40 + "px";
  block.style.top = "0px";
  gameArea.appendChild(block);
  moveBlock(block);
}

// 方塊下落
function moveBlock(block) {
  let blockInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(blockInterval);
      return;
    }

    let blockTop = parseInt(block.style.top);
    block.style.top = blockTop + 5 + "px";

    // 檢查是否撞到玩家
    if (
      blockTop >= 550 &&
      parseInt(block.style.left) === playerX
    ) {
      endGame();
      clearInterval(blockInterval);
    }

    // 超出畫面就刪除
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
  scoreElement.textContent = "分數: " + score;
}

// 遊戲開始
function startGame() {
  resetGame();
  gameOver = false;
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

  // 更新最高分
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = "最高分: " + highScore;
  }

  alert("遊戲結束！你的分數是: " + score);
  restartBtn.style.display = "inline-block";
}

// 重設遊戲
function resetGame() {
  playerX = 180;
  player.style.left = playerX + "px";
  score = 0;
  scoreElement.textContent = "分數: 0";
  // 清除場上的所有方塊
  document.querySelectorAll(".block").forEach(b => b.remove());
}

// 綁定按鈕事件
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

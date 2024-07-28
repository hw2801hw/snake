const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const doubleSpeedButton = document.getElementById('double-speed-button');
const quadSpeedButton = document.getElementById('quad-speed-button');
const leaderboardElement = document.getElementById('leaderboard');
const usernameInput = document.getElementById('username-input');
const createAccountButton = document.getElementById('create-account-button');

let snake = [[3, 3]];
let food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
let direction = 'right';
let score = 0;
let gameInterval;
let speed = 1000; // 一秒一格

// 帳號和排行榜相關變數
let accounts = [];
let leaderboard = [];

function drawBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < 49; i++) {
    const cell = document.createElement('div');
    cell.classList.add('game-cell');
    cell.style.gridColumn = `${(i % 7) + 1} / span 1`;
    cell.style.gridRow = `${Math.floor(i / 7) + 1} / span 1`;
    gameBoard.appendChild(cell);
  }

  snake.forEach((part, index) => {
    const snakePart = document.createElement('div');
    snakePart.classList.add(index === 0 ? 'snake-head' : 'snake-body', 'game-cell');
    snakePart.style.gridColumn = `${part[0] + 1} / span 1`;
    snakePart.style.gridRow = `${part[1] + 1} / span 1`;
    gameBoard.appendChild(snakePart);
  });

  const foodElement = document.createElement('div');
  foodElement.classList.add('food', 'game-cell');
  foodElement.style.gridColumn = `${food[0] + 1} / span 1`;
  foodElement.style.gridRow = `${food[1] + 1} / span 1`;
  gameBoard.appendChild(foodElement);
}

function moveSnake() {
  const head = [...snake[0]];
  switch (direction) {
    case 'up':
      head[1]--;
      break;
    case 'down':
      head[1]++;
      break;
    case 'left':
      head[0]--;
      break;
    case 'right':
      head[0]++;
      break;
  }

  if (head[0] < 0 || head[0] >= 7 || head[1] < 0 || head[1] >= 7 || snake.some(part => part[0] === head[0] && part[1] === head[1])) {
    clearInterval(gameInterval);
    const currentPlayer = accounts.find(account => account.username === usernameInput.value);
    if (currentPlayer) {
      if (score > currentPlayer.highestScore) {
        currentPlayer.highestScore = score;
        updateLeaderboard();
      }
    }
    alert('Game Over!');
    return;
  }

  snake.unshift(head);
  if (head[0] === food[0] && head[1] === food[1]) {
    score++;
    scoreDisplay.textContent = `分數: ${score}`;
    food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
  } else {
    snake.pop();
  }

  drawBoard();
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
});

function updateLeaderboard() {
  leaderboard.sort((a, b) => b.highestScore - a.highestScore);
  leaderboardElement.innerHTML = '';
  leaderboard.forEach((player, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${player.username} - 最高分: ${player.highestScore}`;
    leaderboardElement.appendChild(li);
  });
}

function createAccount() {
  const username = usernameInput.value.trim();
  if (username === '' || accounts.some(account => account.username === username)) {
    alert('請輸入唯一的用戶名');
    return;
  }
  const newAccount = { username, highestScore: 0 };
  accounts.push(newAccount);
  leaderboard.push(newAccount);
  updateLeaderboard();
  usernameInput.value = '';
}

restartButton.addEventListener('click', () => {
  clearInterval(gameInterval);
  snake = [[3, 3]];
  food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
  direction = 'right';
  score = 0;
  scoreDisplay.textContent = `分數: ${score}`;
  const currentPlayer = accounts.find(account => account.username === usernameInput.value);
  if (currentPlayer) {
    if (score > currentPlayer.highestScore) {
      currentPlayer.highestScore = score;
      updateLeaderboard();
    }
  }
  gameInterval = setInterval(moveSnake, speed);
});

doubleSpeedButton.addEventListener('click', () => {
  clearInterval(gameInterval);
  speed = 500; // 一秒兩格
  gameInterval = setInterval(moveSnake, speed);
});

quadSpeedButton.addEventListener('click', () => {
  clearInterval(gameInterval);
  speed = 250; // 一秒四格
  gameInterval = setInterval(moveSnake, speed);
});

createAccountButton.addEventListener('click', createAccount);

gameInterval = setInterval(moveSnake, speed);

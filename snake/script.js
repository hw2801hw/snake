const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const leaderboardTable = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
const restartButton = document.getElementById('restart-button');
const doubleSpeedButton = document.getElementById('double-speed-button');
const quadSpeedButton = document.getElementById('quad-speed-button');

let snake = [[3, 3]];
let food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
let direction = 'right';
let score = 0;
let highScore = 0;
let gameInterval;
let speed = 1000; // 一秒一格

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSPDVNF9jB2Pg8hI0kjj9wIQvitm-RlRc",
  databaseURL: "https://games-99bce-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    updateLeaderboard(score);
    alert('Game Over!');
    return;
  }

  snake.unshift(head);
  if (head[0] === food[0] && head[1] === food[1]) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
  } else {
    snake.pop();
  }

  drawBoard();
}

function updateLeaderboard(score) {
  database.ref('leaderboard').once('value', (snapshot) => {
    const leaderboard = snapshot.val() || [];
    leaderboard.push({ username: 'Player', score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.splice(10);

    database.ref('leaderboard').set(leaderboard);
    updateLeaderboardTable(leaderboard);
  });
}

function updateLeaderboardTable(leaderboard) {
  leaderboardTable.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;
    const usernameCell = document.createElement('td');
    usernameCell.textContent = entry.username;
    const scoreCell = document.createElement('td');
    scoreCell.textContent = entry.score;
    row.appendChild(rankCell);
    row.appendChild(usernameCell);
    row.appendChild(scoreCell);
    leaderboardTable.appendChild(row);
  });
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

restartButton.addEventListener('click', () => {
  clearInterval(gameInterval);
  snake = [[3, 3]];
  food = [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
  direction = 'right';
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
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

// Fetch high score from Firebase
database.ref('leaderboard').once('value', (snapshot) => {
  const leaderboard = snapshot.val() || [];
  if (leaderboard.length > 0) {
    highScore = leaderboard[0].score;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
  updateLeaderboardTable(leaderboard);
});

gameInterval = setInterval(moveSnake, speed);

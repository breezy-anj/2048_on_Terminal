const readline = require('readline');

const arr = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// Start with two numbers
selectRandom();
selectRandom();


function printGrid() {
  console.clear();

  console.log('\n  2048 - TERMINAL EDITION\n');
  console.log('-------------------------');

  for (let i = 0; i < 4; i++) {
    let rowString = '|';
    for (let j = 0; j < 4; j++) {
      let value = arr[i][j];
      let display = value === 0 ? '.' : value.toString();
      rowString += ` ${display.padEnd(4)} `;
    }
    console.log(rowString + '|');
  }
  console.log('-------------------------');
  console.log('Use W/A/S/D to move. Ctrl+C to quit.\n');
}

//GAME LOGIC

function checkWin() {
  for (let row of arr) {
    if (row.includes(2048)) {
      printGrid();
      console.log("\n CONGRATULATIONS! YOU HIT 2048! \n");
      process.exit();
    }
  }
}

function checkGameOver() {
  for (let row of arr) {
    if (row.includes(0))
      return false;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let current = arr[i][j];

      if (j < 3 && current === arr[i][j + 1]) // checks horizontally
        return false;

      if (i < 3 && current === arr[i + 1][j]) // checks vertically
        return false;
    }
  }

  return true;
}

function selectRandom() {
  // Find all empty spots
  let emptySpots = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (arr[i][j] === 0)
        emptySpots.push({ x: i, y: j });
    }
  }

  if (emptySpots.length === 0) return;

  let randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];

  // 90% chance of 2, 10% chance of 4
  arr[randomSpot.x][randomSpot.y] = Math.random() < 0.9 ? 2 : 4;
}



function moveDown() {
  for (let count = 1; count <= 4; count++) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        let current = arr[i][j];
        let bottom = arr[i + 1][j];
        if (bottom === 0 && current !== 0) {
          arr[i + 1][j] = current;
          arr[i][j] = 0;
        }
      }
    }
  }
}

function moveUp() {
  for (let count = 1; count <= 4; count++) {
    for (let i = 3; i > 0; i--) {
      for (let j = 0; j < 4; j++) {
        let current = arr[i][j];
        let up = arr[i - 1][j];
        if (up === 0 && current !== 0) {
          arr[i - 1][j] = current;
          arr[i][j] = 0;
        }
      }
    }
  }
}

function moveRight() {
  for (let count = 1; count <= 4; count++) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        let current = arr[i][j];
        let right = arr[i][j + 1];
        if (right === 0 && current !== 0) {
          arr[i][j + 1] = current;
          arr[i][j] = 0;
        }
      }
    }
  }
}

function moveLeft() {
  for (let count = 1; count <= 4; count++) {
    for (let i = 0; i < 4; i++) {
      for (let j = 3; j > 0; j--) {
        let current = arr[i][j];
        let left = arr[i][j - 1];
        if (left === 0 && current !== 0) {
          arr[i][j - 1] = current;
          arr[i][j] = 0;
        }
      }
    }
  }
}

function mergeDown() {
  for (let i = 3; i > 0; i--) {
    for (let j = 0; j < 4; j++) {
      let current = arr[i][j];
      let up = arr[i - 1][j];
      if (current === up && current !== 0) {
        arr[i][j] = 2 * current;
        arr[i - 1][j] = 0;
        moveDown();
      }
    }
  }
}

function performMove(direction) {
  if (direction === 'up') { moveUp(); mergeUpScan('up'); moveUp(); }
  if (direction === 'down') { moveDown(); mergeDownScan('down'); moveDown(); }
  if (direction === 'left') { moveLeft(); mergeLeftScan('left'); moveLeft(); }
  if (direction === 'right') { moveRight(); mergeRightScan('right'); moveRight(); }
}

function mergeUpScan() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (arr[i][j] !== 0 && arr[i][j] === arr[i + 1][j]) {
        arr[i][j] *= 2;
        arr[i + 1][j] = 0;
      }
    }
  }
}
function mergeDownScan() {
  for (let i = 3; i > 0; i--) {
    for (let j = 0; j < 4; j++) {
      if (arr[i][j] !== 0 && arr[i][j] === arr[i - 1][j]) {
        arr[i][j] *= 2;
        arr[i - 1][j] = 0;
      }
    }
  }
}
function mergeLeftScan() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (arr[i][j] !== 0 && arr[i][j] === arr[i][j + 1]) {
        arr[i][j] *= 2;
        arr[i][j + 1] = 0;
      }
    }
  }
}
function mergeRightScan() {
  for (let i = 0; i < 4; i++) {
    for (let j = 3; j > 0; j--) {
      if (arr[i][j] !== 0 && arr[i][j] === arr[i][j - 1]) {
        arr[i][j] *= 2;
        arr[i][j - 1] = 0;
      }
    }
  }
}


// --- INPUT HANDLING ---
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit();
  const beforeMove = JSON.stringify(arr);

  if (key.name === 'w' || key.name === 'up') {
    performMove('up');
  }
  else if (key.name === 's' || key.name === 'down') {
    performMove('down');
  }
  else if (key.name === 'a' || key.name === 'left') {
    performMove('left');
  }
  else if (key.name === 'd' || key.name === 'right') {
    performMove('right');
  }

  const afterMove = JSON.stringify(arr);

  // Only spawn if the board changed
  if (beforeMove !== afterMove) {
    selectRandom();
    checkWin();

    if (checkGameOver()) {
      printGrid();
      console.log("\n Game Over! You Lost! \n");
      process.exit();
    }
  }

  printGrid();
});

// Start
printGrid();

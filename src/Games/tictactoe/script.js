const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const mode = document.getElementById("modes");
const aiScore = document.getElementById("aiS");
const userScore = document.getElementById("userS");
const radios = document.querySelectorAll('input[name="Char"]');
const aiMode = [modeEazy, modeNormal, hardBot];
let boardHARD = ['', '', '', '', '', '', '', '', ''];
let currentChar = X_CLASS;
let aiChar = CIRCLE_CLASS;
let scoreAi = 0;
let scoreUser = 0;
let selectedIndex;

startGame();

function checkRadio(char) {
  currentChar = char == X_CLASS ? X_CLASS : CIRCLE_CLASS;
  aiChar = char == X_CLASS ? CIRCLE_CLASS : X_CLASS;
}

radios.forEach((radio) => {
  radio.addEventListener("click", (e) => {
    checkRadio(e.target.value);
    startGame();
  });
});


restartButton.addEventListener("click", startGame);

mode.addEventListener('change', startGame)

function modeNormal() {
  let random = Math.floor(Math.random() * 8);
  if (random) {
    hardBot()
  } else {
    eazyBot()
  }
}

function modeEazy() {
  let random = Math.floor(Math.random() * 2);
  if (random) {
    hardBot()
  } else {
    eazyBot()
  }
}

function startGame() {
  window.electronAPI.setTitle
  selectedIndex = mode.selectedIndex;
  cellElements.forEach((cell) => {
    boardHARD = ['', '', '', '', '', '', '', '', ''];
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  
  placeMark(cell, currentChar);
  boardHARD[cell.dataset.cell] = currentChar;

  if (checkWin(currentChar)) {
    endGame(false, currentChar);
  } else if (isDraw()) {
    endGame(true);
  } else {
    setTimeout(() => {
      aiMode[selectedIndex]();
    }, 100);
  }
}

function endGame(draw, char=aiChar) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    if (currentChar == char) {
      scoreUser += selectedIndex * 1 + 1;
    } else {
      scoreAi += selectedIndex * 1 + 1;
    }
    scoreDOM();
    winningMessageTextElement.innerText = `${char == 'x' ? 'X':'O'} Wins!`;
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentChar) {
  cell.classList.add(currentChar);
}

function scoreDOM() {
  userScore.innerHTML = scoreUser;
  aiScore.innerHTML = scoreAi;
}

//////////////////////


function emptySquares() {
  const emptySpots = [];
  cellElements.forEach((cell) => {
    const contain =
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    if (!contain) {
      emptySpots.push(cell);
    }
  });
  return emptySpots;
}

function eazyBot() {
  const availableMoves = emptySquares();
  const bestMove = Math.floor(Math.random() * availableMoves.length);
  const cell = availableMoves[bestMove];
  cell.removeEventListener("click", handleClick);
  boardHARD[cell.dataset.cell] = aiChar;

  placeMark(cell, aiChar);
  if (checkWin(aiChar)) {
    endGame(false, aiChar);
  } else if (isDraw()) {
    endGame(true);
  }
}

function hardBot() {
  const bestMove = minimax(boardHARD, aiChar).index;
  console.log(bestMove, boardHARD);
  const cell = cellElements[bestMove];

  cell.removeEventListener("click", handleClick);
  boardHARD[cell.dataset.cell] = aiChar;
  placeMark(cell, aiChar);

  if (checkWin(aiChar)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  }
}

function emptySpotsBoard(board) {
  const moves = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      moves.push(i);
    }
  }

  return moves;
}

function minimax(boardAi, player) {
  const availableMoves = emptySpotsBoard(boardAi);

  if (checkWinAi(currentChar)) {
    return { score: -1 };
  } else if (checkWinAi(aiChar)) {
    return { score: 1 };
  } else if (availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = {};
    move.index = availableMoves[i];

    boardAi[availableMoves[i]] = player;

    if (player === CIRCLE_CLASS) {
      const result = minimax(boardAi, X_CLASS);
      move.score = result.score;
    } else {
      const result = minimax(boardAi, CIRCLE_CLASS);
      move.score = result.score;
    }

    boardAi[availableMoves[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player !== currentChar) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (currentChar == CIRCLE_CLASS) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(Char) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(Char);
    });
  });
}

function checkWinAi(player) {
  for (let combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (boardHARD[a] === player && boardHARD[b] === player && boardHARD[c] === player) {
      return true;
    }
  }

  return false;
}

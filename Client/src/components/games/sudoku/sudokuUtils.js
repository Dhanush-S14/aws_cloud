export const DIFFICULTY_PRESETS = {
  easy: { label: "Easy", blanks: 36, hints: 5 },
  medium: { label: "Medium", blanks: 45, hints: 3 },
  hard: { label: "Hard", blanks: 54, hints: 2 },
  expert: { label: "Expert", blanks: 58, hints: 1 },
};

export const cloneBoard = (b) => b.map((row) => [...row]);
export const boardsEqual = (a, b) =>
  a.every((row, i) => row.every((v, j) => v === b[i][j]));
export const countEmptyCells = (b) => b.flat().filter((v) => v === 0).length;

const basePattern = (r, c) => (3 * (r % 3) + Math.floor(r / 3) + c) % 9;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function generateSolved() {
  const rows = shuffle([0, 1, 2]).flatMap((r) =>
    shuffle([0, 1, 2]).map((c) => 3 * r + c)
  );
  const cols = shuffle([0, 1, 2]).flatMap((r) =>
    shuffle([0, 1, 2]).map((c) => 3 * r + c)
  );
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const board = Array.from({ length: 9 }, (_, r) =>
    Array.from(
      { length: 9 },
      (_, c) => nums[(basePattern(rows[r], cols[c]) + 0) % 9]
    )
  );
  return board;
}

export function generatePuzzle(level = "medium") {
  const { blanks } = DIFFICULTY_PRESETS[level] || DIFFICULTY_PRESETS.medium;
  let solution = generateSolved();
  let board = cloneBoard(solution);

  // remove numbers randomly to reach target blank count while keeping solvable
  const cells = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );
  let removed = 0;
  for (const [r, c] of cells) {
    if (removed >= blanks) break;
    const temp = board[r][c];
    board[r][c] = 0;
    const solutions = countSolutions(cloneBoard(board), 2);
    if (solutions !== 1) {
      board[r][c] = temp;
    } else {
      removed++;
    }
  }

  const fixed = board.map((row) => row.map((v) => v !== 0));
  return { board, solution, fixed };
}

export function countSolutions(board, cap = Infinity) {
  let count = 0;
  const trySolve = () => {
    const pos = findEmpty(board);
    if (!pos) {
      count++;
      return count;
    }
    const [r, c] = pos;
    for (let n = 1; n <= 9; n++) {
      if (isSafe(board, r, c, n)) {
        board[r][c] = n;
        trySolve();
        if (count >= cap) return count;
        board[r][c] = 0;
      }
    }
    return count;
  };
  trySolve();
  return count;
}

function findEmpty(b) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) if (b[r][c] === 0) return [r, c];
  return null;
}

function isSafe(b, r, c, n) {
  for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) if (b[br + i][bc + j] === n) return false;
  return true;
}

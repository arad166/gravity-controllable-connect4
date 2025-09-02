import { BOARD_COLS, BOARD_ROWS, GravityDirection, Player } from '../types/game';

export type CpuAction =
  | { type: 'move'; position: number }
  | { type: 'gravity'; direction: GravityDirection };

export interface CpuContext {
  board: (Player | null)[][];
  gravityDirection: GravityDirection;
  currentPlayer: Player;
  cpuPlayer: Player;
}

// Helpers
const cloneBoard = (board: (Player | null)[][]): (Player | null)[][] => board.map(row => [...row]);

const applyGravity = (board: (Player | null)[][], direction: GravityDirection): (Player | null)[][] => {
  const newBoard = cloneBoard(board);
  if (direction === 'down') {
    for (let col = 0; col < BOARD_COLS; col++) {
      let bottomRow = BOARD_ROWS - 1;
      for (let row = BOARD_ROWS - 1; row >= 0; row--) {
        if (newBoard[row][col] !== null) {
          if (row !== bottomRow) {
            newBoard[bottomRow][col] = newBoard[row][col];
            newBoard[row][col] = null;
          }
          bottomRow--;
        }
      }
    }
  } else if (direction === 'up') {
    for (let col = 0; col < BOARD_COLS; col++) {
      let topRow = 0;
      for (let row = 0; row < BOARD_ROWS; row++) {
        if (newBoard[row][col] !== null) {
          if (row !== topRow) {
            newBoard[topRow][col] = newBoard[row][col];
            newBoard[row][col] = null;
          }
          topRow++;
        }
      }
    }
  } else if (direction === 'left') {
    for (let row = 0; row < BOARD_ROWS; row++) {
      let leftCol = 0;
      for (let col = 0; col < BOARD_COLS; col++) {
        if (newBoard[row][col] !== null) {
          if (col !== leftCol) {
            newBoard[row][leftCol] = newBoard[row][col];
            newBoard[row][col] = null;
          }
          leftCol++;
        }
      }
    }
  } else if (direction === 'right') {
    for (let row = 0; row < BOARD_ROWS; row++) {
      let rightCol = BOARD_COLS - 1;
      for (let col = BOARD_COLS - 1; col >= 0; col--) {
        if (newBoard[row][col] !== null) {
          if (col !== rightCol) {
            newBoard[row][rightCol] = newBoard[row][col];
            newBoard[row][col] = null;
          }
          rightCol--;
        }
      }
    }
  }
  return newBoard;
};

const checkFour = (board: (Player | null)[][], r: number, c: number, p: Player): boolean => {
  const dirs = [ [0,1], [1,0], [1,1], [1,-1] ];
  for (const [dr, dc] of dirs) {
    let cnt = 1;
    for (let i = 1; i < 4; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr>=0 && nr<BOARD_ROWS && nc>=0 && nc<BOARD_COLS && board[nr][nc] === p) cnt++; else break;
    }
    for (let i = 1; i < 4; i++) {
      const nr = r - dr * i, nc = c - dc * i;
      if (nr>=0 && nr<BOARD_ROWS && nc>=0 && nc<BOARD_COLS && board[nr][nc] === p) cnt++; else break;
    }
    if (cnt >= 4) return true;
  }
  return false;
};

const detectWinner = (board: (Player | null)[][]): Player | null | 'draw' => {
  let winner: Player | null = null;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const cell = board[r][c];
      if (cell) {
        if (checkFour(board, r, c, cell)) {
          if (winner === null) winner = cell; else if (winner !== cell) return null; // simultaneous -> no winner
        }
      }
    }
  }
  if (winner) return winner;
  // draw if no empty cells
  const hasEmpty = board.some(row => row.some(cell => cell === null));
  return hasEmpty ? null : 'draw';
};

const getValidMovePositions = (board: (Player | null)[][], gravity: GravityDirection): number[] => {
  const positions: number[] = [];
  if (gravity === 'down') {
    for (let c = 0; c < BOARD_COLS; c++) if (board[0][c] === null) positions.push(c);
  } else if (gravity === 'up') {
    for (let c = 0; c < BOARD_COLS; c++) if (board[BOARD_ROWS - 1][c] === null) positions.push(c);
  } else {
    for (let r = 0; r < BOARD_ROWS; r++) if (board[r].some(cell => cell === null)) positions.push(r);
  }
  return positions;
};

const getAlternativeGravities = (gravity: GravityDirection): GravityDirection[] => (
  (['down', 'up', 'left', 'right'] as GravityDirection[]).filter(d => d !== gravity)
);

const applyMove = (board: (Player | null)[][], gravity: GravityDirection, position: number, player: Player): (Player | null)[][] | null => {
  const newBoard = cloneBoard(board);
  if (gravity === 'down') {
    let row = 0;
    while (row < BOARD_ROWS && newBoard[row][position] !== null) row++;
    if (row >= BOARD_ROWS) return null;
    newBoard[row][position] = player;
  } else if (gravity === 'up') {
    let row = BOARD_ROWS - 1;
    while (row >= 0 && newBoard[row][position] !== null) row--;
    if (row < 0) return null;
    newBoard[row][position] = player;
  } else if (gravity === 'left') {
    const r = position;
    let c = BOARD_COLS - 1;
    while (c >= 0 && newBoard[r][c] !== null) c--;
    if (c < 0) return null;
    newBoard[r][c] = player;
  } else {
    const r = position;
    let c = 0;
    while (c < BOARD_COLS && newBoard[r][c] !== null) c++;
    if (c >= BOARD_COLS) return null;
    newBoard[r][c] = player;
  }
  return applyGravity(newBoard, gravity);
};

const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const rollout = (board: (Player | null)[][], gravity: GravityDirection, toMove: Player, cpuPlayer: Player): number => {
  // returns 1 if CPU wins, 0.5 draw, 0 loss
  let b = cloneBoard(board);
  let g = gravity;
  let player = toMove;
  let steps = 0;
  while (steps < 64) {
    const winner = detectWinner(b);
    if (winner === cpuPlayer) return 1;
    if (winner && winner !== 'draw') return 0;
    if (winner === 'draw') return 0.5;

    const moves = getValidMovePositions(b, g);
    const gravs = getAlternativeGravities(g);
    const actions: CpuAction[] = [
      ...moves.map(p => ({ type: 'move' as const, position: p })),
      ...gravs.map(d => ({ type: 'gravity' as const, direction: d })),
    ];
    if (actions.length === 0) return 0.5;
    const action = randomChoice(actions);
    if (action.type === 'gravity') {
      b = applyGravity(b, action.direction);
      g = action.direction;
    } else {
      const next = applyMove(b, g, action.position, player);
      if (!next) return 0.5; // illegal fallback
      b = next;
    }
    player = player === 1 ? 2 : 1;
    steps++;
  }
  return 0.5;
};

export const chooseCpuActionNormal = (ctx: CpuContext): CpuAction | null => {
  const { board, gravityDirection, currentPlayer, cpuPlayer } = ctx;

  const movePositions = getValidMovePositions(board, gravityDirection);
  if (movePositions.length === 0) return null;
  const alternativeGravities = getAlternativeGravities(gravityDirection);
  const candidates: CpuAction[] = [
    ...movePositions.map(p => ({ type: 'move' as const, position: p })),
    ...alternativeGravities.map(d => ({ type: 'gravity' as const, direction: d })),
  ];

  // Primitive Monte Carlo evaluation
  const rolloutsPerAction = 36;
  let best: CpuAction | null = null;
  let bestScore = -Infinity;
  for (const action of candidates) {
    let total = 0;
    for (let i = 0; i < rolloutsPerAction; i++) {
      let nextBoard = cloneBoard(board);
      let nextGravity = gravityDirection;
      let nextPlayer: Player = currentPlayer;
      if (action.type === 'gravity') {
        nextBoard = applyGravity(nextBoard, action.direction);
        nextGravity = action.direction;
        nextPlayer = nextPlayer === 1 ? 2 : 1;
      } else {
        const placed = applyMove(nextBoard, nextGravity, action.position, nextPlayer);
        if (!placed) { total += 0; continue; }
        nextBoard = placed;
        nextPlayer = nextPlayer === 1 ? 2 : 1;
      }
      total += rollout(nextBoard, nextGravity, nextPlayer, cpuPlayer);
    }
    const score = total / rolloutsPerAction;
    if (score > bestScore) {
      bestScore = score;
      best = action;
    }
  }
  return best;
};



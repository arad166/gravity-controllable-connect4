/* eslint-disable no-console */
import { BOARD_COLS, BOARD_ROWS, GravityDirection, Player } from '../src/types/game';
import { chooseCpuActionNormal } from '../src/ai/cpuNormal';
import { chooseCpuActionStrong } from '../src/ai/cpuStrong';
import { chooseCpuActionWeak } from '../src/ai/cpuWeak';

type Board = (Player | null)[][];

const createEmptyBoard = (): Board => Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
const cloneBoard = (board: Board): Board => board.map(r => [...r]);

const applyGravity = (board: Board, direction: GravityDirection): Board => {
  const newBoard = cloneBoard(board);
  if (direction === 'down') {
    for (let col = 0; col < BOARD_COLS; col++) {
      let bottomRow = BOARD_ROWS - 1;
      for (let row = BOARD_ROWS - 1; row >= 0; row--) {
        if (newBoard[row][col] !== null) {
          if (row !== bottomRow) { newBoard[bottomRow][col] = newBoard[row][col]; newBoard[row][col] = null; }
          bottomRow--;
        }
      }
    }
  } else if (direction === 'up') {
    for (let col = 0; col < BOARD_COLS; col++) {
      let topRow = 0;
      for (let row = 0; row < BOARD_ROWS; row++) {
        if (newBoard[row][col] !== null) {
          if (row !== topRow) { newBoard[topRow][col] = newBoard[row][col]; newBoard[row][col] = null; }
          topRow++;
        }
      }
    }
  } else if (direction === 'left') {
    for (let row = 0; row < BOARD_ROWS; row++) {
      let leftCol = 0;
      for (let col = 0; col < BOARD_COLS; col++) {
        if (newBoard[row][col] !== null) {
          if (col !== leftCol) { newBoard[row][leftCol] = newBoard[row][col]; newBoard[row][col] = null; }
          leftCol++;
        }
      }
    }
  } else if (direction === 'right') {
    for (let row = 0; row < BOARD_ROWS; row++) {
      let rightCol = BOARD_COLS - 1;
      for (let col = BOARD_COLS - 1; col >= 0; col--) {
        if (newBoard[row][col] !== null) {
          if (col !== rightCol) { newBoard[row][rightCol] = newBoard[row][col]; newBoard[row][col] = null; }
          rightCol--;
        }
      }
    }
  }
  return newBoard;
};

const checkFour = (board: Board, r: number, c: number, p: Player): boolean => {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]] as const;
  for (const [dr, dc] of dirs) {
    let cnt = 1;
    for (let i = 1; i < 4; i++) { const nr = r + dr*i, nc = c + dc*i; if (nr>=0&&nr<BOARD_ROWS&&nc>=0&&nc<BOARD_COLS&&board[nr][nc]===p) cnt++; else break; }
    for (let i = 1; i < 4; i++) { const nr = r - dr*i, nc = c - dc*i; if (nr>=0&&nr<BOARD_ROWS&&nc>=0&&nc<BOARD_COLS&&board[nr][nc]===p) cnt++; else break; }
    if (cnt >= 4) return true;
  }
  return false;
};

const detectWinnerDoubleAware = (board: Board): { winner: Player | null; isDouble: boolean; isDraw: boolean } => {
  let winner: Player | null = null;
  let seenOther = false;
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const cell = board[r][c];
      if (cell && checkFour(board, r, c, cell)) {
        if (winner === null) winner = cell; else if (winner !== cell) { seenOther = true; break; }
      }
    }
    if (seenOther) break;
  }
  if (seenOther) return { winner: null, isDouble: true, isDraw: false };
  if (winner) return { winner, isDouble: false, isDraw: false };
  const hasEmpty = board.some(row => row.some(cell => cell === null));
  return { winner: null, isDouble: false, isDraw: !hasEmpty };
};

const getValidMovePositions = (board: Board, gravity: GravityDirection): number[] => {
  const pos: number[] = [];
  if (gravity === 'down') { for (let c = 0; c < BOARD_COLS; c++) if (board[0][c] === null) pos.push(c); }
  else if (gravity === 'up') { for (let c = 0; c < BOARD_COLS; c++) if (board[BOARD_ROWS-1][c] === null) pos.push(c); }
  else { for (let r = 0; r < BOARD_ROWS; r++) if (board[r].some(cell => cell === null)) pos.push(r); }
  return pos;
};

const applyMove = (board: Board, gravity: GravityDirection, position: number, player: Player): Board | null => {
  const b = cloneBoard(board);
  if (gravity === 'down') { let row = 0; while (row<BOARD_ROWS && b[row][position]!==null) row++; if (row>=BOARD_ROWS) return null; b[row][position]=player; }
  else if (gravity === 'up') { let row = BOARD_ROWS-1; while (row>=0 && b[row][position]!==null) row--; if (row<0) return null; b[row][position]=player; }
  else if (gravity === 'left') { const r = position; let c = BOARD_COLS-1; while (c>=0 && b[r][c]!==null) c--; if (c<0) return null; b[r][c]=player; }
  else { const r = position; let c = 0; while (c<BOARD_COLS && b[r][c]!==null) c++; if (c>=BOARD_COLS) return null; b[r][c]=player; }
  return applyGravity(b, gravity);
};

export const runOneGameNormalVsStrong = (): 'normal' | 'strong' | 'draw' => {
  let board = createEmptyBoard();
  let gravity: GravityDirection = 'down';
  const normal: Player = 1;
  const strong: Player = 2;
  let current: Player = Math.random() < 0.5 ? 1 : 2;
  let steps = 0;
  while (steps < 400) {
    const res = detectWinnerDoubleAware(board);
    if (res.isDouble) return 'draw';
    if (res.winner === normal) return 'normal';
    if (res.winner === strong) return 'strong';
    if (res.isDraw) return 'draw';

    if (current === normal) {
      const action = chooseCpuActionNormal({ board, gravityDirection: gravity, currentPlayer: current, cpuPlayer: normal });
      if (!action) return 'draw';
      if (action.type === 'gravity') { board = applyGravity(board, action.direction); gravity = action.direction; }
      else { const nb = applyMove(board, gravity, action.position, current); if (!nb) return 'draw'; board = nb; }
    } else {
      const action = chooseCpuActionStrong({ board, gravityDirection: gravity, currentPlayer: current, cpuPlayer: strong });
      if (!action) return 'draw';
      if (action.type === 'gravity') { board = applyGravity(board, action.direction); gravity = action.direction; }
      else { const nb = applyMove(board, gravity, action.position, current); if (!nb) return 'draw'; board = nb; }
    }
    current = current === 1 ? 2 : 1;
    steps++;
  }
  return 'draw';
};

export const runSeriesNormalVsStrong = (n: number, progressEvery: number = 1): { normal: number; strong: number; draw: number } => {
  let normalWins = 0, strongWins = 0, draws = 0;
  for (let i = 0; i < n; i++) {
    const r = runOneGameNormalVsStrong();
    if (r === 'normal') normalWins++; else if (r === 'strong') strongWins++; else draws++;
    const played = i + 1;
    if (progressEvery > 0 && played % progressEvery === 0) {
      console.log(`[Progress] ${played}/${n} -> Normal: ${normalWins}, Strong: ${strongWins}, Draw: ${draws}`);
    }
  }
  return { normal: normalWins, strong: strongWins, draw: draws };
};

type PolicyName = 'weak' | 'normal' | 'strong';

type PolicyFn = (ctx: { board: Board; gravityDirection: GravityDirection; currentPlayer: Player; cpuPlayer: Player }) => { type: 'move'; position: number } | { type: 'gravity'; direction: GravityDirection } | null;

const policies: Record<PolicyName, PolicyFn> = {
  weak: chooseCpuActionWeak,
  normal: chooseCpuActionNormal,
  strong: chooseCpuActionStrong,
};

const runOneGame = (a: PolicyName, b: PolicyName): PolicyName | 'draw' => {
  let board = createEmptyBoard();
  let gravity: GravityDirection = 'down';
  const A: Player = 1;
  const B: Player = 2;
  let current: Player = Math.random() < 0.5 ? A : B;
  let steps = 0;
  while (steps < 400) {
    const res = detectWinnerDoubleAware(board);
    if (res.isDouble) return 'draw';
    if (res.winner === A) return a;
    if (res.winner === B) return b;
    if (res.isDraw) return 'draw';

    if (current === A) {
      const action = policies[a]({ board, gravityDirection: gravity, currentPlayer: current, cpuPlayer: A });
      if (!action) return 'draw';
      if (action.type === 'gravity') { board = applyGravity(board, action.direction); gravity = action.direction; }
      else { const nb = applyMove(board, gravity, action.position, current); if (!nb) return 'draw'; board = nb; }
    } else {
      const action = policies[b]({ board, gravityDirection: gravity, currentPlayer: current, cpuPlayer: B });
      if (!action) return 'draw';
      if (action.type === 'gravity') { board = applyGravity(board, action.direction); gravity = action.direction; }
      else { const nb = applyMove(board, gravity, action.position, current); if (!nb) return 'draw'; board = nb; }
    }
    current = current === A ? B : A;
    steps++;
  }
  return 'draw';
};

const runSeries = (a: PolicyName, b: PolicyName, n: number, progressEvery: number = 1): { [k in PolicyName | 'draw']: number } => {
  const tally: { [k in PolicyName | 'draw']: number } = { weak: 0, normal: 0, strong: 0, draw: 0 };
  for (let i = 0; i < n; i++) {
    const r = runOneGame(a, b);
    tally[r] = (tally[r] ?? 0) + 1;
    const played = i + 1;
    if (progressEvery > 0 && played % progressEvery === 0) {
      console.log(`[Progress ${a} vs ${b}] ${played}/${n} -> weak:${tally.weak}, normal:${tally.normal}, strong:${tally.strong}, draw:${tally.draw}`);
    }
  }
  return tally;
};

const main = () => {
  const perMatchArg = process.argv[2];
  const progressArg = process.argv[3];
  const perMatch = perMatchArg ? parseInt(perMatchArg, 10) : 20;
  const progressEvery = progressArg ? parseInt(progressArg, 10) : 1;
  const n = Number.isFinite(perMatch) && perMatch > 0 ? perMatch : 20;
  const p = Number.isFinite(progressEvery) && progressEvery > 0 ? progressEvery : 1;

  const pairs: [PolicyName, PolicyName][] = [
    ['weak', 'normal'],
    ['weak', 'strong'],
    ['normal', 'strong'],
  ];

  const results: Record<string, { [k in PolicyName | 'draw']: number }> = {};
  for (const [a, b] of pairs) {
    console.log(`\n=== ${a} vs ${b} (${n} games) ===`);
    results[`${a}_vs_${b}`] = runSeries(a, b, n, p);
  }

  console.log('\n=== Summary ===');
  for (const key of Object.keys(results)) {
    const r = results[key];
    console.log(`${key}: weak:${r.weak}, normal:${r.normal}, strong:${r.strong}, draw:${r.draw}`);
  }
};

// Execute only when run directly via ts-node
if (require.main === module) {
  main();
}



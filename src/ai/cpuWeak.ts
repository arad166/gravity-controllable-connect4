import { BOARD_COLS, BOARD_ROWS, GravityDirection, Player } from '../types/game';

export type CpuAction =
  | { type: 'move'; position: number }
  | { type: 'gravity'; direction: GravityDirection };

export interface CpuContext {
  board: (Player | null)[][];
  gravityDirection: GravityDirection;
}

// Weak CPU: choose randomly between a valid move and a gravity change
export const chooseCpuActionWeak = (ctx: CpuContext): CpuAction | null => {
  const { board, gravityDirection } = ctx;

  const getValidPositions = (): number[] => {
    const positions: number[] = [];
    if (gravityDirection === 'down') {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (board[0][c] === null) positions.push(c);
      }
    } else if (gravityDirection === 'up') {
      for (let c = 0; c < BOARD_COLS; c++) {
        if (board[BOARD_ROWS - 1][c] === null) positions.push(c);
      }
    } else if (gravityDirection === 'left') {
      for (let r = 0; r < BOARD_ROWS; r++) {
        if (board[r].some(cell => cell === null)) positions.push(r);
      }
    } else if (gravityDirection === 'right') {
      for (let r = 0; r < BOARD_ROWS; r++) {
        if (board[r].some(cell => cell === null)) positions.push(r);
      }
    }
    return positions;
  };

  const getAlternativeGravities = (): GravityDirection[] => {
    const all: GravityDirection[] = ['down', 'up', 'left', 'right'];
    return all.filter(d => d !== gravityDirection);
  };

  const positions = getValidPositions();
  if (positions.length === 0) return null;
  const alternativeGravities = getAlternativeGravities();

  const actions: CpuAction[] = positions.map(p => ({ type: 'move' as const, position: p }));
  actions.push(...alternativeGravities.map(d => ({ type: 'gravity' as const, direction: d })));

  const choice = actions[Math.floor(Math.random() * actions.length)];
  return choice;
};



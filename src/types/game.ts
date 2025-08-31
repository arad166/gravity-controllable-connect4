export type Player = 1 | 2;

export type Cell = Player | null;

export type Board = Cell[][];

export type GameStatus = 'playing' | 'won' | 'draw';

export type GravityDirection = 'down' | 'up' | 'left' | 'right';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  gravityDirection: GravityDirection;
}

export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;

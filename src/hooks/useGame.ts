import { useState, useCallback } from 'react';
import { GameState, Board, Player, BOARD_ROWS, BOARD_COLS } from '../types/game';

const createEmptyBoard = (): Board => {
  return Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
};

const checkWinner = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    [0, 1],   // 水平
    [1, 0],   // 垂直
    [1, 1],   // 右下がり斜め
    [1, -1],  // 左下がり斜め
  ];

  return directions.some(([dRow, dCol]) => {
    let count = 1;
    
    // 正方向にカウント
    for (let i = 1; i < 4; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      if (
        newRow >= 0 && newRow < BOARD_ROWS &&
        newCol >= 0 && newCol < BOARD_COLS &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }
    
    // 負方向にカウント
    for (let i = 1; i < 4; i++) {
      const newRow = row - i * dRow;
      const newCol = col - i * dCol;
      if (
        newRow >= 0 && newRow < BOARD_ROWS &&
        newCol >= 0 && newCol < BOARD_COLS &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }
    
    return count >= 4;
  });
};

const checkDraw = (board: Board): boolean => {
  return board[0].every(cell => cell !== null);
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    gameStatus: 'playing',
    winner: null,
  });

  const makeMove = useCallback((col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    // 指定された列の最下段から空いているセルを探す
    let row = BOARD_ROWS - 1;
    while (row >= 0 && gameState.board[row][col] !== null) {
      row--;
    }
    
    if (row < 0) return; // 列が満杯
    
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = gameState.currentPlayer;
    
    // 勝利判定
    const hasWon = checkWinner(newBoard, row, col, gameState.currentPlayer);
    
    if (hasWon) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameStatus: 'won',
        winner: gameState.currentPlayer,
      }));
    } else if (checkDraw(newBoard)) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameStatus: 'draw',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
      }));
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      gameStatus: 'playing',
      winner: null,
    });
  }, []);

  return {
    gameState,
    makeMove,
    resetGame,
  };
};

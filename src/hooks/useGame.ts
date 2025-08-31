import { useState, useCallback } from 'react';
import { GameState, Board, Player, BOARD_ROWS, BOARD_COLS, GravityDirection } from '../types/game';

const createEmptyBoard = (): Board => {
  return Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
};

// 重力に応じて駒を移動させる
const applyGravity = (board: Board, direction: GravityDirection): Board => {
  const newBoard = board.map(row => [...row]);
  
  if (direction === 'down') {
    // 下向き重力（デフォルト）
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
    // 上向き重力
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
    // 左向き重力
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
    // 右向き重力
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

// 重力方向に応じた勝利判定
const checkWinnerWithGravity = (board: Board, direction: GravityDirection): { winner: Player | null; hasWon: boolean } => {
  let winner: Player | null = null;
  let hasWon = false;
  
  // 全セルをチェック
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (board[row][col] !== null) {
        const player = board[row][col] as Player;
        if (checkWinner(board, row, col, player)) {
          if (winner === null) {
            winner = player;
            hasWon = true;
          } else if (winner !== player) {
            // 両プレイヤーが同時に勝利した場合は引き分け
            return { winner: null, hasWon: false };
          }
        }
      }
    }
  }
  
  return { winner, hasWon };
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
  // 重力方向に応じて引き分け判定を調整
  return board.every(row => row.every(cell => cell !== null));
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    gameStatus: 'playing',
    winner: null,
    gravityDirection: 'down',
  });

  const makeMove = useCallback((col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    // 重力方向に応じて挿入位置を決定
    let row = -1;
    let insertCol = col;
    
    if (gameState.gravityDirection === 'down') {
      // 下向き重力：上から挿入
      row = 0;
      while (row < BOARD_ROWS && gameState.board[row][col] !== null) {
        row++;
      }
      if (row >= BOARD_ROWS) return; // 列が満杯
    } else if (gameState.gravityDirection === 'up') {
      // 上向き重力：下から挿入
      row = BOARD_ROWS - 1;
      while (row >= 0 && gameState.board[row][col] !== null) {
        row--;
      }
      if (row < 0) return; // 列が満杯
    } else if (gameState.gravityDirection === 'left') {
      // 左向き重力：右から挿入（列は固定、行を変更）
      insertCol = BOARD_COLS - 1;
      row = col; // colは行のインデックスとして使用
      while (insertCol >= 0 && gameState.board[row][insertCol] !== null) {
        insertCol--;
      }
      if (insertCol < 0) return; // 行が満杯
    } else if (gameState.gravityDirection === 'right') {
      // 右向き重力：左から挿入（列は固定、行を変更）
      insertCol = 0;
      row = col; // colは行のインデックスとして使用
      while (insertCol < BOARD_COLS && gameState.board[row][insertCol] !== null) {
        insertCol++;
      }
      if (insertCol >= BOARD_COLS) return; // 行が満杯
    }
    
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][insertCol] = gameState.currentPlayer;
    
    // 重力を適用
    const boardAfterGravity = applyGravity(newBoard, gameState.gravityDirection);
    
    // 勝利判定
    const { winner, hasWon } = checkWinnerWithGravity(boardAfterGravity, gameState.gravityDirection);
    
    if (hasWon) {
      setGameState(prev => ({
        ...prev,
        board: boardAfterGravity,
        gameStatus: 'won',
        winner,
      }));
    } else if (checkDraw(boardAfterGravity)) {
      setGameState(prev => ({
        ...prev,
        board: boardAfterGravity,
        gameStatus: 'draw',
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: boardAfterGravity,
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
      }));
    }
  }, [gameState]);

  const changeGravity = useCallback((direction: GravityDirection) => {
    if (gameState.gameStatus !== 'playing') return;
    
    // 重力を変更
    const newBoard = applyGravity(gameState.board, direction);
    
    // 勝利判定
    const { winner, hasWon } = checkWinnerWithGravity(newBoard, direction);
    
    if (hasWon) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameStatus: 'won',
        winner,
        gravityDirection: direction,
      }));
    } else if (checkDraw(newBoard)) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gameStatus: 'draw',
        gravityDirection: direction,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        gravityDirection: direction,
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
      gravityDirection: 'down',
    });
  }, []);

  return {
    gameState,
    makeMove,
    changeGravity,
    resetGame,
  };
};

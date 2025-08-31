import React from 'react';
import { Board as BoardType, GravityDirection, BOARD_ROWS, BOARD_COLS } from '../types/game';
import './Board.css';

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  currentPlayer: number;
  gameStatus: 'playing' | 'won' | 'draw';
  gravityDirection: GravityDirection;
}

export const Board: React.FC<BoardProps> = ({ 
  board, 
  onColumnClick, 
  currentPlayer, 
  gameStatus,
  gravityDirection 
}) => {
  const handleInsertClick = (position: number) => {
    onColumnClick(position);
  };

  const boardClassName = `board ${gameStatus === 'won' ? 'victory' : ''}`;

  // 重力方向に応じて有効な挿入ボタンを決定
  const getValidInsertButtons = () => {
    const buttons = [];
    
    // 上向きボタン（常に表示）
    buttons.push(
      <div key="top" className="insert-buttons top">
        {Array.from({ length: 7 }, (_, colIndex) => (
          <div
            key={colIndex}
            className={`insert-btn ${gravityDirection === 'down' && board[0][colIndex] === null ? 'active' : 'inactive'}`}
            data-player={currentPlayer}
            onClick={() => gravityDirection === 'down' && board[0][colIndex] === null && handleInsertClick(colIndex)}
          >
            ▼
          </div>
        ))}
      </div>
    );

    // 下向きボタン（常に表示）
    buttons.push(
      <div key="bottom" className="insert-buttons bottom">
        {Array.from({ length: 7 }, (_, colIndex) => (
          <div
            key={colIndex}
            className={`insert-btn ${gravityDirection === 'up' && board[BOARD_ROWS - 1][colIndex] === null ? 'active' : 'inactive'}`}
            data-player={currentPlayer}
            onClick={() => gravityDirection === 'up' && board[BOARD_ROWS - 1][colIndex] === null && handleInsertClick(colIndex)}
          >
            ▲
          </div>
        ))}
      </div>
    );

    // 左向きボタン（常に表示）
    buttons.push(
      <div key="left" className="insert-buttons left">
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className={`insert-btn ${gravityDirection === 'right' && board[rowIndex][0] === null ? 'active' : 'inactive'}`}
            data-player={currentPlayer}
            onClick={() => gravityDirection === 'right' && board[rowIndex][0] === null && handleInsertClick(rowIndex)}
          >
            ▶
          </div>
        ))}
      </div>
    );

    // 右向きボタン（常に表示）
    buttons.push(
      <div key="right" className="insert-buttons right">
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className={`insert-btn ${gravityDirection === 'left' && board[rowIndex][BOARD_COLS - 1] === null ? 'active' : 'inactive'}`}
            data-player={currentPlayer}
            onClick={() => gravityDirection === 'left' && board[rowIndex][BOARD_COLS - 1] === null && handleInsertClick(rowIndex)}
          >
            ◀
          </div>
        ))}
      </div>
    );
    
    return buttons;
  };

  return (
    <div className={boardClassName}>
      {/* 重力方向に応じた挿入ボタン */}
      {getValidInsertButtons()}
      
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${cell ? `player-${cell}` : ''}`}
              >
                {cell && <div className="coin" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Board as BoardType } from '../types/game';
import './Board.css';

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  currentPlayer: number;
}

export const Board: React.FC<BoardProps> = ({ board, onColumnClick, currentPlayer }) => {
  const handleColumnClick = (col: number) => {
    onColumnClick(col);
  };

  return (
    <div className="board">
      {/* 矢印インジケーター */}
      <div className="arrow-indicators">
        {Array.from({ length: 7 }, (_, colIndex) => (
          <div
            key={colIndex}
            className={`arrow-indicator ${board[0][colIndex] === null ? 'active' : 'inactive'}`}
            data-player={currentPlayer}
            onClick={() => board[0][colIndex] === null && handleColumnClick(colIndex)}
          >
            ▼
          </div>
        ))}
      </div>
      
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

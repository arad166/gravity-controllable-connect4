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
      <div className="board-header">
        <div className="current-player">
          Current Player: <span className={`player-${currentPlayer}`}>Player {currentPlayer}</span>
        </div>
      </div>
      
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`board-cell ${cell ? `player-${cell}` : ''}`}
                onClick={() => handleColumnClick(colIndex)}
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

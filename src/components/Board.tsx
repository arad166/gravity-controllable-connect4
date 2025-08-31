import React from 'react';
import { Board as BoardType, GravityDirection, BOARD_ROWS, BOARD_COLS } from '../types/game';
import './Board.css';

interface BoardProps {
  board: BoardType;
  onColumnClick: (col: number) => void;
  currentPlayer: number;
  gameStatus: 'playing' | 'won' | 'draw';
  gravityDirection: GravityDirection;
  onGravityChange: (direction: GravityDirection) => void;
}

export const Board: React.FC<BoardProps> = ({ 
  board, 
  onColumnClick, 
  currentPlayer, 
  gameStatus,
  gravityDirection,
  onGravityChange
}) => {
  const handleInsertClick = (position: number) => {
    onColumnClick(position);
  };

  const boardClassName = `board ${gameStatus === 'won' ? 'victory' : ''}`;

  // 重力方向に応じて有効な挿入ボタンと重力操作ボタンを決定
  const getValidInsertButtons = () => {
    const buttons = [];
    
    // 上向きボタン（重力が下向きの時のみ有効、それ以外は重力操作ボタン）
    buttons.push(
      <div key="top" className="insert-buttons top">
        {gravityDirection === 'down' ? (
          // 駒挿入ボタン（7個）
          Array.from({ length: 7 }, (_, colIndex) => (
            <div
              key={colIndex}
              className={`insert-btn ${board[0][colIndex] === null ? 'active' : 'inactive'}`}
              data-player={currentPlayer}
              onClick={() => board[0][colIndex] === null && handleInsertClick(colIndex)}
            >
              ▼
            </div>
          ))
        ) : (
          // 重力操作ボタン（1個、幅は盤面に合わせる）
          <div
            className="insert-btn gravity-control wide"
            data-player={currentPlayer}
            onClick={() => handleGravityChange('down')}
          >
            <div className="gravity-text">Change Gravity</div>
            <div className="gravity-arrow">▼</div>
          </div>
        )}
      </div>
    );

    // 下向きボタン（重力が上向きの時のみ有効、それ以外は重力操作ボタン）
    buttons.push(
      <div key="bottom" className="insert-buttons bottom">
        {gravityDirection === 'up' ? (
          // 駒挿入ボタン（7個）
          Array.from({ length: 7 }, (_, colIndex) => (
            <div
              key={colIndex}
              className={`insert-btn ${board[BOARD_ROWS - 1][colIndex] === null ? 'active' : 'inactive'}`}
              data-player={currentPlayer}
              onClick={() => board[BOARD_ROWS - 1][colIndex] === null && handleInsertClick(colIndex)}
            >
              ▲
            </div>
          ))
        ) : (
          // 重力操作ボタン（1個、幅は盤面に合わせる）
          <div
            className="insert-btn gravity-control wide"
            data-player={currentPlayer}
            onClick={() => handleGravityChange('up')}
          >
            <div className="gravity-text">Change Gravity</div>
            <div className="gravity-arrow">▲</div>
          </div>
        )}
      </div>
    );

    // 左向きボタン（重力が右向きの時のみ有効、それ以外は重力操作ボタン）
    buttons.push(
      <div key="left" className="insert-buttons left">
        {gravityDirection === 'right' ? (
          // 駒挿入ボタン（6個）
          Array.from({ length: 6 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`insert-btn ${board[rowIndex][0] === null ? 'active' : 'inactive'}`}
              data-player={currentPlayer}
              onClick={() => board[rowIndex][0] === null && handleInsertClick(rowIndex)}
            >
              ▶
            </div>
          ))
        ) : (
          // 重力操作ボタン（1個、高さは盤面に合わせる）
          <div
            className="insert-btn gravity-control tall"
            data-player={currentPlayer}
            onClick={() => handleGravityChange('right')}
          >
            <div className="gravity-text">Change Gravity▼</div>
          </div>
        )}
      </div>
    );

    // 右向きボタン（重力が左向きの時のみ有効、それ以外は重力操作ボタン）
    buttons.push(
      <div key="right" className="insert-buttons right">
        {gravityDirection === 'left' ? (
          // 駒挿入ボタン（6個）
          Array.from({ length: 6 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`insert-btn ${board[rowIndex][BOARD_COLS - 1] === null ? 'active' : 'inactive'}`}
              data-player={currentPlayer}
              onClick={() => board[rowIndex][BOARD_COLS - 1] === null && handleInsertClick(rowIndex)}
            >
              ◀
            </div>
          ))
        ) : (
          // 重力操作ボタン（1個、高さは盤面に合わせる）
          <div
            className="insert-btn gravity-control tall"
            data-player={currentPlayer}
            onClick={() => handleGravityChange('left')}
          >
            <div className="gravity-text">Change Gravity▼</div>
          </div>
        )}
      </div>
    );
    
    return buttons;
  };

  const handleGravityChange = (direction: GravityDirection) => {
    // 重力変更の処理を親コンポーネントに委譲
    onGravityChange(direction);
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

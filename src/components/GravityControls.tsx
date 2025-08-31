import React from 'react';
import { GravityDirection } from '../types/game';
import './GravityControls.css';

interface GravityControlsProps {
  currentGravity: GravityDirection;
  onGravityChange: (direction: GravityDirection) => void;
  gameStatus: 'playing' | 'won' | 'draw';
  currentPlayer: number;
}

export const GravityControls: React.FC<GravityControlsProps> = ({
  currentGravity,
  onGravityChange,
  gameStatus,
  currentPlayer,
}) => {
  // ゲームが終了していても重力操作は可能
  const isDisabled = false;

  const handleGravityChange = (direction: GravityDirection) => {
    // 現在の重力方向と異なる場合のみ変更可能
    if (direction !== currentGravity) {
      onGravityChange(direction);
    }
  };

  return (
    <div className="gravity-controls">
      <h3>Gravity Control</h3>
      <div className="gravity-buttons">
        <button
          className={`gravity-btn up ${currentGravity === 'up' ? 'active' : ''}`}
          onClick={() => handleGravityChange('up')}
          disabled={currentGravity === 'up'}
          data-player={currentPlayer}
          title="上向き重力"
        >
          ↑
        </button>
        <div className="gravity-row">
          <button
            className={`gravity-btn left ${currentGravity === 'left' ? 'active' : ''}`}
            onClick={() => handleGravityChange('left')}
            disabled={currentGravity === 'left'}
            data-player={currentPlayer}
            title="左向き重力"
          >
            ←
          </button>
          <div className="current-gravity">
            <span className="gravity-label">現在</span>
            <span className="gravity-arrow">
              {currentGravity === 'down' && '↓'}
              {currentGravity === 'up' && '↑'}
              {currentGravity === 'left' && '←'}
              {currentGravity === 'right' && '→'}
            </span>
          </div>
          <button
            className={`gravity-btn right ${currentGravity === 'right' ? 'active' : ''}`}
            onClick={() => handleGravityChange('right')}
            disabled={currentGravity === 'right'}
            data-player={currentPlayer}
            title="右向き重力"
          >
            →
          </button>
        </div>
        <button
          className={`gravity-btn down ${currentGravity === 'down' ? 'active' : ''}`}
          onClick={() => handleGravityChange('down')}
          disabled={currentGravity === 'down'}
          data-player={currentPlayer}
          title="下向き重力"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

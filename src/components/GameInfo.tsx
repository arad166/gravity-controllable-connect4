import React from 'react';
import { GameStatus } from '../types/game';
import './GameInfo.css';

interface GameInfoProps {
  gameStatus: GameStatus;
  winner: number | null;
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameStatus, winner, onReset }) => {
  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return `Player ${winner} wins!`;
      case 'draw':
        return "Draw!";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  // 勝ったプレイヤーの色に合わせてクラス名を設定
  const getStatusMessageClass = () => {
    if (gameStatus === 'won' && winner) {
      return `status-message won player-${winner}`;
    }
    return `status-message ${gameStatus}`;
  };

  return (
    <div className="game-info">
      {statusMessage && (
        <div className={getStatusMessageClass()}>
          {statusMessage}
        </div>
      )}
      
      {(gameStatus === 'won' || gameStatus === 'draw') && (
        <button className="reset-button" onClick={onReset}>
          Play Again
        </button>
      )}
    </div>
  );
};

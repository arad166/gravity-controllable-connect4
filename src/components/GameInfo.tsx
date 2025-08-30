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
        return "It's a draw!";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="game-info">
      {statusMessage && (
        <div className={`status-message ${gameStatus}`}>
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

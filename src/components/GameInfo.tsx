import React from 'react';
import { GameStatus, GameMode, Player } from '../types/game';
import './GameInfo.css';

interface GameInfoProps {
  gameStatus: GameStatus;
  winner: number | null;
  currentPlayer: number; // 現在のプレイヤーを追加
  mode: GameMode;
  cpuPlayer: Player | null;
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameStatus, winner, currentPlayer, mode, cpuPlayer, onReset }) => {
  const getDisplayName = (player: number | null) => {
    if (player == null) return '';
    if (mode === 'human-vs-cpu') {
      return player === cpuPlayer ? 'CPU' : 'Player';
    }
    return `Player ${player}`;
  };

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return `${getDisplayName(winner)} wins!`;
      case 'draw':
        return "Draw!";
      default:
        return `Current Player: <span class="player-name">${getDisplayName(currentPlayer)}</span>`;
    }
  };

  const statusMessage = getStatusMessage();

  // 勝ったプレイヤーの色に合わせてクラス名を設定
  const getStatusMessageClass = () => {
    if (gameStatus === 'won' && winner) {
      return `status-message won player-${winner}`;
    }
    if (gameStatus === 'playing') {
      return `status-message playing player-${currentPlayer}`;
    }
    return `status-message ${gameStatus}`;
  };

  // ボタンのテキストを動的に設定
  const getButtonText = () => {
    if (gameStatus === 'won' || gameStatus === 'draw') {
      return 'Play Again';
    }
    return 'Reset';
  };

  // ゲーム中のメッセージをJSXで表示（HTMLタグを含む場合）
  const renderStatusMessage = () => {
    if (gameStatus === 'playing') {
      return (
        <>
          Current Player: <span className="player-name">{getDisplayName(currentPlayer)}</span>
        </>
      );
    }
    return statusMessage;
  };

  return (
    <div className="game-info">
      {/* 常にメッセージを表示（ゲーム中は現在のプレイヤー、終了時は結果） */}
      <div className={getStatusMessageClass()}>
        {renderStatusMessage()}
      </div>
      
      {/* 常にボタンを表示して位置を固定 */}
      <button className="reset-button" onClick={onReset}>
        {getButtonText()}
      </button>
    </div>
  );
};

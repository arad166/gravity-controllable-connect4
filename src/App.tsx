import React, { useState } from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { useGame } from './hooks/useGame';
import { GameMode, CpuDifficulty } from './types/game';
import './App.css';

function App() {
  const { gameState, makeMove, changeGravity, resetGame, setMode, setCpuDifficulty } = useGame();
  const [showInfo, setShowInfo] = useState(false);

  const isCpuTurn = gameState.mode === 'human-vs-cpu' && gameState.cpuPlayer === gameState.currentPlayer && gameState.gameStatus === 'playing';

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as GameMode;
    setMode(mode);
  };


  return (
    <div className="App">
      <main className="App-main">
        <div className="game-container">
          <div className="mode-bar">
            <div className="mode-controls">
              <div className="mode-label">Mode</div>
              <div className="mode-row">
                <div className="mode-toggle info-inline" aria-label="Game info">
                  <button className="mode-btn" onClick={() => setShowInfo(true)} title="ゲーム情報">
                    <span className="mode-icon">ℹ️</span>
                    <span className="mode-text">Info</span>
                  </button>
                </div>
                <div className="mode-toggle" role="tablist" aria-label="Game mode">
                <button
                  role="tab"
                  aria-selected={gameState.mode === 'human-vs-human'}
                  className={`mode-btn ${gameState.mode === 'human-vs-human' ? 'active' : ''}`}
                  onClick={() => setMode('human-vs-human')}
                  title="Human vs Human"
                >
                  <span className="mode-icon">👥</span>
                  <span className="mode-text">Human</span>
                </button>
                <button
                  role="tab"
                  aria-selected={gameState.mode === 'human-vs-cpu'}
                  className={`mode-btn ${gameState.mode === 'human-vs-cpu' ? 'active' : ''}`}
                  onClick={() => setMode('human-vs-cpu')}
                  title="Human vs CPU"
                >
                  <span className="mode-icon">🤖</span>
                  <span className="mode-text">CPU</span>
                </button>
                </div>
              </div>
            </div>
            <div className="mode-controls difficulty">
              <div className="mode-label">Difficulty</div>
              <div className="difficulty-row">
                <div className="mode-toggle" role="tablist" aria-label="CPU difficulty">
                  <button
                    role="tab"
                    aria-selected={gameState.cpuDifficulty === 'weak'}
                    className={`mode-btn ${gameState.cpuDifficulty === 'weak' ? 'active' : ''}`}
                    onClick={() => setCpuDifficulty('weak')}
                    title="Weak"
                    disabled={gameState.mode === 'human-vs-human'}
                  >
                    <span className="mode-icon">🐇</span>
                    <span className="mode-text">Weak</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={gameState.cpuDifficulty === 'normal'}
                    className={`mode-btn ${gameState.cpuDifficulty === 'normal' ? 'active' : ''}`}
                    onClick={() => setCpuDifficulty('normal')}
                    title="Normal"
                    disabled={gameState.mode === 'human-vs-human'}
                  >
                    <span className="mode-icon">🐑</span>
                    <span className="mode-text">Normal</span>
                  </button>
                  <button
                    role="tab"
                    aria-selected={gameState.cpuDifficulty === 'strong'}
                    className={`mode-btn ${gameState.cpuDifficulty === 'strong' ? 'active' : ''}`}
                    onClick={() => setCpuDifficulty('strong')}
                    title="Strong"
                    disabled={gameState.mode === 'human-vs-human'}
                  >
                    <span className="mode-icon">🦁</span>
                    <span className="mode-text">Strong</span>
                  </button>
                </div>
                <div className="mode-toggle reset-inline" aria-label="Reset game">
                  <button className="mode-btn" onClick={resetGame} title="Reset">
                    <span className="mode-icon">🔄</span>
                    <span className="mode-text">Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Board
            board={gameState.board}
            onColumnClick={isCpuTurn ? () => {} : makeMove}
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.gameStatus}
            gravityDirection={gameState.gravityDirection}
            onGravityChange={isCpuTurn ? () => {} : changeGravity}
          />
          
          <div className="controls-section">
            <GameInfo
              gameStatus={gameState.gameStatus}
              winner={gameState.winner}
              currentPlayer={gameState.currentPlayer}
              mode={gameState.mode}
              cpuPlayer={gameState.cpuPlayer}
              onReset={resetGame}
            />
          </div>
        </div>
      </main>
      
      {/* Info Modal */}
      {showInfo && (
        <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h2>Gravity Controllable Connect 4</h2>
              <button className="close-btn" onClick={() => setShowInfo(false)}>×</button>
            </div>
            <div className="info-modal-content">
              <h3>遊び方</h3>
              <ul>
                <li>重力操作可能なコネクト4です。</li>
                <li>縦・横・斜めのいずれかに4つのコマを並べると勝利です。</li>
                <li>自分のターンでは、次のいずれかを行えます。
                  <ul>
                    <li>空いている列にコマを挿入する（現在の重力方向にコマが落下します）</li>
                    <li>重力方向を変更する</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

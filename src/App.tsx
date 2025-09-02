import React from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { useGame } from './hooks/useGame';
import { GameMode, CpuDifficulty } from './types/game';
import './App.css';

function App() {
  const { gameState, makeMove, changeGravity, resetGame, setMode, setCpuDifficulty } = useGame();

  const isCpuTurn = gameState.mode === 'human-vs-cpu' && gameState.cpuPlayer === gameState.currentPlayer && gameState.gameStatus === 'playing';

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as GameMode;
    setMode(mode);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Gravity Controllable Connect 4</h1>
      </header>
      
      <main className="App-main">
        <div className="game-container">
          <div className="mode-bar">
            <div className="mode-controls">
              <div className="mode-label">Mode</div>
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
            <div className="mode-controls difficulty">
              <div className="mode-label">Difficulty</div>
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
    </div>
  );
}

export default App;

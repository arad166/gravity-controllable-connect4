import React from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { GravityControls } from './components/GravityControls';
import { useGame } from './hooks/useGame';
import './App.css';

function App() {
  const { gameState, makeMove, changeGravity, resetGame } = useGame();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gravity Controllable Connect 4</h1>
      </header>
      
      <main className="App-main">
        <div className="game-container">
          <Board
            board={gameState.board}
            onColumnClick={makeMove}
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.gameStatus}
            gravityDirection={gameState.gravityDirection}
          />
          
          <div className="controls-section">
            <GravityControls
              currentGravity={gameState.gravityDirection}
              onGravityChange={changeGravity}
              gameStatus={gameState.gameStatus}
              currentPlayer={gameState.currentPlayer}
            />
            
            <GameInfo
              gameStatus={gameState.gameStatus}
              winner={gameState.winner}
              currentPlayer={gameState.currentPlayer}
              onReset={resetGame}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

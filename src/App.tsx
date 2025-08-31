import React from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { useGame } from './hooks/useGame';
import './App.css';

function App() {
  const { gameState, makeMove, resetGame } = useGame();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gravity Controllable Connect 4</h1>
      </header>
      
      <main className="App-main">
        <Board
          board={gameState.board}
          onColumnClick={makeMove}
          currentPlayer={gameState.currentPlayer}
        />
        
        <GameInfo
          gameStatus={gameState.gameStatus}
          winner={gameState.winner}
          onReset={resetGame}
        />
      </main>
    </div>
  );
}

export default App;

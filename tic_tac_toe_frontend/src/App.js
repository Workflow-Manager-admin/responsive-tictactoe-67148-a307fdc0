import React, { useState } from "react";
import "./App.css";

/**
 * Color/Style palette as CSS variables
 *  Primary:   #1976d2 (blue)
 *  Secondary: #f50057 (pink)
 *  Accent:    #ffeb3b (yellow)
 *  (See App.css for theme usage.)
 */

// PUBLIC_INTERFACE
function App() {
  // Game state: board (array of 9), X is true for X's turn, null for blank
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null); // "X" | "O" | null
  const [winningLine, setWinningLine] = useState([]);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isDraw, setIsDraw] = useState(false);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = isX ? "X" : "O";
    setBoard(nextBoard);
    const evalWinner = calculateWinner(nextBoard);
    if (evalWinner?.winner) {
      setWinner(evalWinner.winner);
      setWinningLine(evalWinner.line);
      setScore(prev =>
        evalWinner.winner
          ? { ...prev, [evalWinner.winner]: prev[evalWinner.winner] + 1 }
          : prev
      );
      setIsDraw(false);
    } else if (nextBoard.every(v => v)) {
      setIsDraw(true);
      setWinner(null);
    } else {
      setIsX(x => !x);
      setWinner(null);
      setIsDraw(false);
      setWinningLine([]);
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  }

  // PUBLIC_INTERFACE
  function handleResetScore() {
    setScore({ X: 0, O: 0 });
    handleRestart();
  }

  // PUBLIC_INTERFACE
  function calculateWinner(bd) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let l of lines) {
      const [a, b, c] = l;
      if (bd[a] && bd[a] === bd[b] && bd[b] === bd[c]) {
        return { winner: bd[a], line: l };
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function renderSquare(idx) {
    const highlight = winningLine.includes(idx);
    return (
      <button
        key={idx}
        className={`ttt-square${highlight ? " ttt-highlight" : ""}`}
        onClick={() => handleClick(idx)}
        aria-label={
          board[idx]
            ? `Cell ${idx + 1}: ${board[idx]}`
            : `Cell ${idx + 1}: Empty`
        }
      >
        <span>{board[idx]}</span>
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function getStatus() {
    if (winner) {
      return (
        <span>
          <span className="ttt-winner">{winner}</span> wins!
        </span>
      );
    }
    if (isDraw) return <span>It's a <span className="ttt-draw">draw!</span></span>;
    return (
      <span>
        Turn: <span className={`ttt-turn ttt-${isX ? "x" : "o"}`}>{isX ? "X" : "O"}</span>
      </span>
    );
  }

  // PUBLIC_INTERFACE
  function Instructions() {
    return (
      <div className="ttt-instructions">
        <strong>How to Play:</strong>
        <ul>
          <li>Two players alternate turns on the same device.</li>
          <li>Tap a square to place your mark (X or O).</li>
          <li>First player to align 3 in a row wins!</li>
          <li>If all squares are filled without a winner, it's a draw.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="ttt-app-ctr">
      <header className="ttt-header">
        <span role="img" aria-label="Tic Tac Toe" className="ttt-logo">
          <svg width="38" height="38" viewBox="0 0 38 38"><g><rect x="13" y="1" width="2" height="36" fill="#1976d2"/><rect x="23" y="1" width="2" height="36" fill="#1976d2"/><rect x="1" y="13" width="36" height="2" fill="#1976d2"/><rect x="1" y="23" width="36" height="2" fill="#1976d2"/></g></svg>
        </span>
        <h1 className="ttt-title">Tic Tac Toe</h1>
      </header>
      <div className="ttt-main">
        <section className="ttt-status-ctr">
          <div className="ttt-status" aria-live="polite">{getStatus()}</div>
          <div className="ttt-scoreboard">
            <span>
              <span className="ttt-x">X</span>: {score.X}
            </span>
            <span>
              <span className="ttt-o">O</span>: {score.O}
            </span>
            <button onClick={handleResetScore} className="ttt-score-reset" aria-label="Reset Scoreboard">
              Reset
            </button>
          </div>
        </section>
        <section className="ttt-board-ctr">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
            {Array(9)
              .fill(0)
              .map((_, i) => renderSquare(i))}
          </div>
        </section>
        <div className="ttt-controls">
          <button
            onClick={handleRestart}
            className="ttt-btn"
            aria-label="Restart Game"
          >
            Restart Game
          </button>
        </div>
        <Instructions />
      </div>
      <footer className="ttt-footer">
        <span>
          &copy; {new Date().getFullYear()} Tic Tac Toe &mdash; React Minimal UI
        </span>
      </footer>
    </div>
  );
}

export default App;

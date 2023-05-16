import { useState } from 'react';
import Image from 'next/image';

function Square(props: any) {      
  return (
    <button className="square" onClick={props.onSquareClick}>{props.value}</button>    
  );
}

function Board({ xIsNext, squares, onPlay, onRestart }: { xIsNext: any, squares: any, onPlay: any, onRestart: any }) {  
  
  function handleClick(i: number) {
    if (squares[i] != "" || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();    
    nextSquares[i] = xIsNext ? "X" : "O";               
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status, command;
  if (winner) {    
    status = "Player '" + winner + "' won!";
    command = "New Game";    
  } else {
    status = "Player " + (xIsNext ? "'X'" : "'O'");
    command = "Restart";
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>   
      <button className="restart" onClick={onRestart}>{command}</button>  
    </>
  )
}

function Moves({history, onJumpTo} : {history: any[], onJumpTo: any}){

  const moves = history.map((squares, move) => {    
    let description;
    if (move >= 0) {
      description = move;
    }     
    return (
      <li className="move-list-item" key={move}>
        <button className="move" onClick={() => onJumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <ol className="move-list">
        {moves}
      </ol>
    </>
  );
}

export default function Game() {
  
  const [history, setHistory] = useState([Array(9).fill('')]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];  

  function handlePlay(nextSquares: any[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);    
  }

  function jumpTo(nextMove: any) {    
    setCurrentMove(nextMove);       
  }

  function restartGame() {    
    setHistory([Array(9).fill('')]);
    setCurrentMove(0);    
  }

  return (
    <div className="game">      
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onRestart={restartGame} />
      </div>
      <div className="game-history">        
        <Moves history={history} onJumpTo={jumpTo} />        
      </div>
    </div>
  );
}

function calculateWinner(squares: any[]) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] != "" && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
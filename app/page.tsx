import React from 'react';
import AStar from '../src/aStar';
import './App.css';

function App() {
  return (
    <div className="App" >
      <h1>A* Pathfinding in React with p5.js</h1>
      <div className="grid-container">
        <AStar />
      </div>
    </div>
  );
}

export default App;


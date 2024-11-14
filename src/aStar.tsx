// Grid.js
'use client'
import React, { useState, useEffect } from 'react';
import './aStar.css';

const LIGHTGREY = '#D3D3D3';
const DARKRED = '#aa3333';
const BLACK = '#010101';
const DARKGREEN = '#33aa33';

class GridBox {
  constructor(id, color, label, x, y) {
    this.id = id;
    this.color = color;
    this.label = label;
    this.x = x; // X position in grid
    this.y = y; // Y position in grid
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.type = 'open';
    this.prevNode;
  }
}


const aStar = ({ columns = 20, cellSize = 20 }) => {
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [openSet, setOpenSet] = useState([]);
  const [closedSet, setClosedSet] = useState([]);
  const [nighbors, setNeighbors] = useState([]);

  // State for grid boxes, assigning each box an (x, y) coordinate
  const [boxes, setBoxes] = useState(
    Array.from({ length: columns * columns }, (_, i) => {
      const x = i % columns;
      const y = Math.floor(i / columns);
      return new GridBox(i, LIGHTGREY, `Box ${i + 1}`, x, y);
    })
  );

  // State to control different modes (e.g., 'Mode 1', 'Mode 2', 'Mode 3')
  const [mode, setMode] = useState('Mode 0');

  // State for a running loop
  const [running, setRunning] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [mouseState, setmouseState] = useState('up');

  const push = (setArray, newElement) => {
    setArray((prevArray) => {
      const updatedArray = [...prevArray, newElement];
      return updatedArray;
    });
  };
  
  const pop = (setArray) => {
    setArray((prevArray) => prevArray.slice(0, -1));
  };

  const aStarPath = () => {

    

  };

  // Handler for clicking a box
  const handleClick = (id) => {
    getNeighbors(id);
    console.log(`Box ${id} clicked in ${mode}!`);
    setBoxes((prevBoxes) => {
      // Clone the previous array of boxes
      const updatedBoxes = [...prevBoxes];
      
      // Find the box to update
      const boxIndex = updatedBoxes.findIndex((box) => box.id === id);
      if (boxIndex !== -1) {
        // Update the color of the existing box
        
      };
      return updatedBoxes; // Set the updated array as the new state
    });
  };

  const handleMouseDown = (id) => {
    setmouseState('down');
    updateBoxColor(id);
  };

  const handleMouseEnter = (id) => {
    if (mouseState === 'down') {
      updateBoxColor(id);
    }
    
  };

  const getNeighbors = (id) => {
    //setNeighbors([]);
    let boxIndex = id;
    let size = boxes.length;
    setNeighbors(() => {
      const newNeighbors = []
      for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          newNeighbors.push(setNeighbors,boxes.findIndex(() => ))
        }
      }
      
      console.log(newNeighbors)
      return newNeighbors;
    });
  };

  const updateBoxColor = (id) => {
    setBoxes((prevBoxes) => {
      // Clone the previous array of boxes
      const updatedBoxes = [...prevBoxes];
      
      // Find the box to update
      const boxIndex = id; //updatedBoxes.findIndex((box) => box.id === id);
      if (boxIndex !== -1 ) {
        // Update the color of the existing box
        if (mode === 'Mode 1') {
          if (startNode == null){
            updatedBoxes[boxIndex].color = DARKRED;
            updatedBoxes[boxIndex].type = 'start';
            setStartNode(updatedBoxes[boxIndex]); 
          } else {
            let temp = startNode;
            updatedBoxes[boxIndex].color = DARKRED;
            updatedBoxes[boxIndex].type = 'start';
            setStartNode(updatedBoxes[boxIndex]);
            temp.color = LIGHTGREY;
            temp.type = 'open';
          }
        } else if (mode === 'Mode 2') {
          if (endNode == null){
            updatedBoxes[boxIndex].color = DARKGREEN;
            updatedBoxes[boxIndex].type = 'end';
            setEndNode(updatedBoxes[boxIndex]); 
          } else {
            let temp = endNode;
            updatedBoxes[boxIndex].color = DARKGREEN;
            updatedBoxes[boxIndex].type = 'end';
            setEndNode(updatedBoxes[boxIndex]);
            temp.color = LIGHTGREY;
            temp.type = 'open';
          }
        } else if (mode === 'Mode 3' && 
          updatedBoxes[boxIndex] != startNode && 
          updatedBoxes[boxIndex] != endNode) {
          updatedBoxes[boxIndex].color = BLACK;
          updatedBoxes[boxIndex].type = 'wall';
          //startNode = updatedBoxes[boxIndex];
        }
      };
      return updatedBoxes; // Set the updated array as the new state
    });
  };

  // Toggle running state
  const toggleRunning = () => {
    setRunning((prev) => !prev);
  };



  // Effect for running loop
  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setLoopCount((prevCount) => prevCount + 1);
        console.log(`Loop running: ${loopCount}`);
      }, 1000); // Runs every 1 second

      return () => clearInterval(interval); // Cleanup interval on unmount or when `running` changes
    }
  }, [running, loopCount]);

  return (
    <div onMouseUp={() => setmouseState('up')}>
      {/* Control Buttons */}
      <div className='modeButtpn-container'>
        <button className="control-buttons" onClick={() => setMode('Mode 1')}>Place Start</button>
        <button className="control-buttons" onClick={() => setMode('Mode 2')}>Place End</button>
        <button className="control-buttons" onClick={() => setMode('Mode 3')}>Place Wall</button>
        <button className="control-buttons" onClick={toggleRunning}>
          {running ? 'Stop Loop' : 'Start Loop'}
        </button>
      </div>

      {/* Display current mode and loop count */}
      <div>
        <p>Current Mode: {mode}</p>
        <p>Loop Count: {loopCount}</p>
      </div>

      {/* Grid Layout */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        }}
      >
        {boxes.map((box) => (
          <button
            key={box.id}
            className="grid-box"
            style={{
              backgroundColor: box.color,
              width: `${cellSize}px`,
              height: `${cellSize}px`, // Ensure square shape
            }}
            onClick={() => handleClick(box.id)}
            onMouseDown={() => handleMouseDown(box.id)}
            onMouseEnter={() => handleMouseEnter(box.id)}
          >
            {/* {box.x},{box.y} */}
          </button>
        ))}
      </div>
    </div>
  );
};

// Function to generate a random color for each box
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default aStar;
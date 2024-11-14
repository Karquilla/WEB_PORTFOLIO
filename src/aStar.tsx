// Grid.js
'use client'
import React, { useState, useEffect } from 'react';
import './aStar.css';
import { start } from 'repl';

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
  const [startNode, setStartNode]     = useState(null);
  const [endNode, setEndNode]         = useState(null);
  //const [openSet, setOpenSet]         = useState([]);
  const [closedSet, setClosedSet]     = useState([]);
  //const [neighbors, setNeighbors]      = useState([]);
  //const [pathNodes, setPathNeighbors] = useState([]);

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

  //const removeFromArray = (id, setArray, Node) => {
  //  setArray.findIndex((Node) => Node.id === id);
  //}

  const aStarPath = async () => {
    if (!startNode || !endNode) {
      console.error("Start or end node not set");
      return;
    }
  
    // Initialize Manhattan heuristic, g, and f scores for each box
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        const h = Math.abs(box.x - endNode.x) + Math.abs(box.y - endNode.y); // Manhattan distance
        return {
          ...box,
          h: box.type === 'wall' ? Infinity : h,
          f: 0,
          g: 0,
          prevNode: null,
        };
      })
    );
  
    // Set initial values for startNode

    // Initialize open and closed sets with just the start node
    let openSet = [startNode];
    let closedSet = [];
  
    // Main A* loop
    while (openSet.length > 0) {
      // Sort openSet by f score to always pick the node with the lowest f
      let nextBest = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[nextBest].f > openSet[i].f) { // Fixed typo `nextbest` to `nextBest`
          nextBest = i;
        }
      }
      const currentNode = openSet[nextBest]; // Node with the lowest f score
  
      // Check if the current node is the end node
      if (currentNode === endNode) {
        let path = [];
        let temp = currentNode;
  
        // Trace back to startNode to reconstruct the path
        while (temp) {
          path.unshift(temp);
          temp = temp.prevNode;
        }
  
        // Highlight the path nodes
        for (let node of path) {
          setBoxes((prevBoxes) =>
            prevBoxes.map((box) =>
              box.id === node.id ? { ...box, color: DARKGREEN } : box
            )
          );
          await sleep(50); // Visualization delay for the path
        }
        return; // Exit once the path is found and visualized
      }
  
      // Remove currentNode from openSet and add to closedSet
      openSet.shift(); // Remove the node with the lowest f score (already at index 0)
      closedSet.push(currentNode);
  
      // Update the color for closed set nodes
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === currentNode.id ? { ...box, color: '#FFA07A' } : box
        )
      );
  
      // Get neighbors of currentNode
      const neighbors = getNeighbors(currentNode.id);
  
      for (let neighborId of neighbors) {
        let neighbor = boxes.find((box) => box.id === neighborId);
        if (closedSet.some((closedNode) => closedNode.id === neighbor.id) || neighbor.type === 'wall') {
          continue; // Skip walls and nodes already in closedSet
        }
  
        let tempG = currentNode.g + 1; // Incremental cost from start to this neighbor
  
        // Only consider this new path if it’s better or if the neighbor hasn’t been explored
        const neighborInOpenSet = openSet.some((node) => node.id === neighbor.id);
        if (!neighborInOpenSet || tempG < neighbor.g) {
          neighbor.g = tempG;
          neighbor.f = neighbor.g + neighbor.h; // Update f score with g + h
          neighbor.prevNode = currentNode;
  
          if (!neighborInOpenSet) {
            openSet.push(neighbor);
  
            // Visualization: Mark neighbor as part of the open set
            setBoxes((prevBoxes) =>
              prevBoxes.map((box) =>
                box.id === neighbor.id ? { ...box, color: '#ADD8E6' } : box
              )
            );
          }
        }
      }
      console.log(openSet)
      await sleep(50); // Delay for visualizing each step
    }
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
    // Retrieve the current node's position based on the given id
    let currNodeIndex = boxes.findIndex((box) => box.id === id);
    if (currNodeIndex === -1) return []; // If not found, return an empty array
  
    let currNode = boxes[currNodeIndex];
    let xPos = currNode.x;
    let yPos = currNode.y;
    
    const newNeighbors = [];
    
    // Check neighboring positions using offsets
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        if (offsetX === 0 && offsetY === 0) continue; // Skip the current node itself
  
        // Calculate the neighboring position
        let neighborX = xPos + offsetX;
        let neighborY = yPos + offsetY;
  
        // Find the neighbor by position
        let neighbor = boxes.find((box) => box.x === neighborX && box.y === neighborY);
        if (neighbor) {
          if (closedSet.includes(neighbor) || neighbor.state === "wall") {
            continue;
          }
          newNeighbors.push(neighbor.id);
        }
      }
    }
    
    //console.log(newNeighbors);
    return newNeighbors;
  };
  
  function sleep(ms) {
    console.log("timer started")
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if (!running) {
      setRunning(true);
      aStarPath().then(() => setRunning(false));
    } else {
      setRunning(false);
    }
  };



  // Effect for running loop
  //useEffect(() => {
  //  if (running) {
  //    const interval = setInterval(() => {
  //      setLoopCount((prevCount) => prevCount + 1);
  //      console.log(`Loop running: ${loopCount}`);
  //      aStarPath();
  //      toggleRunning;
  //    }, 1000); // Runs every 1 second
  //
  //    return () => clearInterval(interval); // Cleanup interval on unmount or when `running` changes
  //  }
  //}, [running, loopCount]);

  return (
    <div onMouseUp={() => setmouseState('up')}>
      {/* Control Buttons */}
      <div className="modeButtpn-container">
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
            className={`grid-box ${
              box.color === DARKGREEN
                ? 'path'
                : box.color === '#87CEEB'
                ? 'checked'
                : box.color === '#FFA07A'
                ? 'closed'
                : ''
            }`}
            style={{
              backgroundColor: box.color,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            onClick={() => handleClick(box.id)}
            onMouseDown={() => handleMouseDown(box.id)}
            onMouseEnter={() => handleMouseEnter(box.id)}
          >
            {/* Optional content */}
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
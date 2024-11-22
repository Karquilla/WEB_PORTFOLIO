// Grid.js
'use client'
import React, { useState} from 'react';
import styles from '../components/aStar.module.css';
//import { start } from 'repl';

const LIGHTGREY = '#D3D3D3';
const DARKRED = '#aa3333';
const BLACK = '#010101';
const DARKGREEN = '#33aa33';

class GridBox {

  id: number; // Declare the property and its type
  color: string;
  label: string;
  x: number; // Use `number` instead of `Number` for TypeScript typing
  y: number;
  g: number; // Use `number` instead of `Number` for TypeScript typing
  h: number;
  f: number;
  type: string;
  prevNode: GridBox | null; // Declare prevNode as either a GridBox or null


  constructor(id :number, color :string, label :string, x:number, y:number) {
    this.id = id;
    this.color = color;
    this.label = label;
    this.x = x; // X position in grid
    this.y = y;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.type = 'open';
    this.prevNode = null;
  }
}


const Astar = ({ columns = 40, rows = 20, cellSize = 20 }) => {
  const [startNode, setStartNode]     = useState<GridBox | null>(null);
  const [endNode, setEndNode]         = useState<GridBox | null>(null);
  // State for grid boxes, assigning each box an (x, y) coordinate
  const [boxes, setBoxes] = useState(
    Array.from({ length: columns * rows }, (_, i) => {
      return new GridBox(i, LIGHTGREY, `Box ${i + 1}`, i % (columns), Math.floor(i / columns));
    })
  );

  // State to control different modes (e.g., 'Mode 1', 'Mode 2', 'Mode 3')
  const [mode, setMode] = useState('Mode 0');

  // State for a running loop
  const [running, setRunning] = useState(false);
  const [mouseState, setmouseState] = useState('up');

  //const push = (setArray, newElement) => {
  //  setArray((prevArray) => {
  //    const updatedArray = [...prevArray, newElement];
  //    return updatedArray;
  //  });
  //};
  //
  //const pop = (setArray) => {
  //  setArray((prevArray) => prevArray.slice(0, -1));
  //};

  //const removeFromArray = (id, setArray, Node) => {
  //  setArray.findIndex((Node) => Node.id === id);
  //}

  const aStarPath = async () => {
    if (!startNode || !endNode) {
      console.error("Start or end node not set");
      return;
    }
  
    const mutableBoxes = [...boxes]; // Create a mutable copy of boxes for internal use
  
    // Initialize scores and heuristic for all nodes
    for (const box of mutableBoxes) {
      box.g = Infinity; // Cost from start to this node
      box.h = Math.abs(box.x - endNode.x) + Math.abs(box.y - endNode.y); // Manhattan heuristic
      box.f = Infinity; // Total cost (g + h)
      box.prevNode = null; // Reset previous node
    }
  
    const start = mutableBoxes[startNode.id];
    start.g = 0; // Starting node has zero cost
    start.f = start.h;
  
    const openSet = [start]; // Nodes to be evaluated
    const closedSet = []; // Already evaluated nodes
  
    while (openSet.length > 0) {
      // Find node with the lowest `f` score in the open set
      let bestIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[bestIndex].f) {
          bestIndex = i;
        }
      }
      const currentNode = openSet[bestIndex];
  
      // Visualize the current node
      //setBoxes((prevBoxes) =>
      //  prevBoxes.map((box) =>
      //    box.id === currentNode.id ? { ...box, color: '#000000' } : box
      //  )
      //);
  
      // Check if we've reached the end node
      if (currentNode === mutableBoxes[endNode.id]) {
        // Reconstruct the path
        const path:GridBox[] = [];
        let temp: GridBox | null = currentNode;
        while (temp !== null) {
          path.unshift(temp);
          temp = temp.prevNode;
        }
  
        // Visualize the path
        for (const node of path) {
          setBoxes((prevBoxes) =>
            prevBoxes.map((box) =>
              box.id === node.id ? { ...box, color: DARKGREEN } : box
            )
          );
          await sleep(50); // Visualization delay
        }
        return; // Exit when the path is found
      }
  
      // Move currentNode from openSet to closedSet
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.push(currentNode);
  
      // Visualize the closed set
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === currentNode.id ? { ...box, color: '#FFA07A' } : box
        )
      );
  
      // Get neighbors of the current node
      const neighbors = getNeighbors(currentNode.id);
  
      for (const neighborId of neighbors) {
        const neighbor = mutableBoxes[neighborId];
  
        if (closedSet.includes(neighbor) || neighbor.type === 'wall') {
          continue; // Skip walls or already evaluated nodes
        }
  
        // Tentative g score
        const tentativeG = currentNode.g + 1; 
  
        if (tentativeG < neighbor.g) {
          // Found a better path
          neighbor.g = tentativeG;
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.prevNode = currentNode;
  
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
  
            // Visualize open set
            setBoxes((prevBoxes) =>
              prevBoxes.map((box) =>
                box.id === neighbor.id ? { ...box, color: '#ADD8E6' } : box
              )
            );
          }
        }
      }
      await sleep(50); // Delay for visualization
    }
    console.error("No path found");
  };
  
  
  

  // Handler for clicking a box
  const handleClick = (id:number) => {
    getNeighbors(id);
    //const box = boxes[id];
    //const x = box ? box.x : null;
    //const y = box ? box.y : null;

    //console.log(`Box ${id} clicked in ${mode}!, posx ${x} posy ${y}`);
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

  const handleMouseDown = (id:number) => {
    setmouseState('down');
    updateBoxColor(id);
  };

  const handleMouseEnter = (id:number) => {
    if (mouseState === 'down') {
      updateBoxColor(id);
    }
    
  };

  const getNeighbors = (id:number) => {
    const currentNode = boxes[id];
    const directions = [
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 },  // Down
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 },  // Right
      { dx: -1, dy: -1},
      { dx: 1, dy: 1},
      { dx: 1, dy: -1},
      { dx: -1, dy: 1},
    ];
  
    return directions
      .map(({ dx, dy }) => {
        const neighbor = boxes.find(
          (box) => box.x === currentNode.x + dx && box.y === currentNode.y + dy
        );
        return neighbor && neighbor.type !== 'wall' ? neighbor.id : null;
      })
      .filter((neighborId) => neighborId !== null);
  };
  
  function sleep(ms :number) {
    //console.log("timer started")
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const updateBoxColor = (id:number) => {
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
            const temp = startNode;
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
            const temp = endNode;
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

  return (
    <div 
      onMouseUp={() => setmouseState('up')}
      >

      {/* Control Buttons */}
      <div className={styles.modeButtpn_container}>
        <button className={styles.control_buttons} onClick={() => setMode('Mode 1')}>Place Start</button>
        <button className={styles.control_buttons} onClick={() => setMode('Mode 2')}>Place End</button>
        <button className={styles.control_buttons} onClick={() => setMode('Mode 3')}>Place Wall</button>
        <button className={styles.control_buttons} onClick={toggleRunning}>
          {running ? 'Reset Loop' : 'Start search'}
        </button>
      </div>
  
      {/* Display current mode and loop count */}
      <div className={styles.h1}>
        <p>Selection: {mode}</p>
      </div>
  
      {/* Grid Layout */}
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`, 
        }}
      >
        {boxes.map((box) => (
          <button
            key={box.id}
            className={styles.grid_box}
            style={{
              backgroundColor: box.color,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
            onClick={() => (!running) ? handleClick(box.id) : null}
            onMouseDown={() => (!running) ? handleMouseDown(box.id): null}
            onMouseEnter={() => (!running) ? handleMouseEnter(box.id): null}
            
          >
            {/* Optional content */}
      {/* Display f score */}
      <span
        style={{
          fontSize: '12px', // Adjust font size to fit the box
          color: '#ffffff', // Text color for visibility
          pointerEvents: 'none', // Prevent interfering with button clicks
        }}
      >
        {box.f !== Infinity ? box.f : null}
      </span>
          </button>
        ))}
      </div>
      
    </div>
  );
};

// Function to generate a random color for each box
//const getRandomColor = () => {
//  const letters = '0123456789ABCDEF';
//  let color = '#';
//  for (let i = 0; i < 6; i++) {
//    color += letters[Math.floor(Math.random() * 16)];
//  }
//  return color;
//};

export default Astar;
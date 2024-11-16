'use client'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AStar from '../src/aStar';
import Home from '../src/home'
import Navbar from "../src/navbar";
import './App.css';
//<div className="App" >
//      <h1>A* Pathfinding in React with p5.js</h1>
//      <div className="grid-container">
//        <AStar />
//      </div>
//    </div>

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AStar" element={ <div className="grid-container">  <AStar /></div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;




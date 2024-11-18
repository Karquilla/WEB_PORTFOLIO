'use client'


import React from "react";
//import Link from 'next/link'
//import AStar from '../src/aStar';
import Home from '../components/home';
import Navbar from "../components/navbar";
import './App.module.css';

const page = () => {
  return (
    <div><Navbar />
    <Home />
    </div>
  );
};

export default page;


//<div className="layout">
//        <div className="-container">
//          <div className="control-container"></div>
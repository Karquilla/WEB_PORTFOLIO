'use client'


import React from "react";
//import Link from 'next/link'
//import AStar from '../src/aStar';
import Home from '../components/home';
import Navbar from "../components/navbar";
import styles from './App.module.css';

export default function page() {
  return (
    <div className={styles.layout}> 
      <div className={styles.container}> <Navbar /> </div>
      <div className={styles.container}> <Home /></div>
    </div>
  );
}


//<div className="layout">
//        <div className="-container">
//          <div className="control-container"></div>
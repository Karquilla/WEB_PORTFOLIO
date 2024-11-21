'use client'
import React from "react";
import  Link  from "next/link";
import styles from "./navbar.module.css";

const Navbar = () => {
  
  return (
      <nav>
      <ul>
        <div className={styles.sidebar}>
        <li ><Link href="/Home" className={styles.control_button}><span>Home</span></Link></li>
        <li ><Link href="/AStar" className={styles.control_button}>A-Star</Link></li>
        </div>
      </ul>
      </nav>
    
    
  );
};

export default Navbar;
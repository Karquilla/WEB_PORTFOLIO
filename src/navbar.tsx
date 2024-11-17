'use client'
import React from "react";
import  Link  from "next/link";
import "./navbar.css";

const Navbar = () => {
  return (
    
      <nav>
      <ul>
        <div className='control-container'>
        <li ><Link href="/Home" className="control-button"><span>Home</span></Link></li>
        <li ><Link href="/AStar" className="control-button">A*</Link></li>
        </div>
      </ul>
      </nav>
    
    
  );
};

export default Navbar;
'use client'
import React from "react";
import  Link  from "next/link";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className='control-container'>
      <nav>
      <ul>
        <li className="control-button"><Link href="/Home">Home</Link></li>
        <li className="control-button"><Link href="/AStar">A*</Link></li>
      </ul>
      </nav>
    </div>
    
  );
};

export default Navbar;
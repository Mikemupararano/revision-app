import React from 'react';
import { Link } from "react-router-dom";
import './Home.css'; // Importing the CSS module
import Home from './code-craft-home.jpg';


function HomePage() {
  return (
    <div className="home">
      <div className="headerContainer">
        <img src={Home} alt="man coding" />
        {/* <p className="home-description lead">CodeCraft: Elevating Your Coding Mastery Tenfold!</p> */}
        
              </div>
      
    </div>
  );
}

export default HomePage;

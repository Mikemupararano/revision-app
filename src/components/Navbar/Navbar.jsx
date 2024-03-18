import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Make sure the CSS file path is correct
import Logo from './logo.png';

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  return (
    <div className="container-fluid text-white">
      <nav className="navbar">
        <div className={`leftSide ${openLinks ? 'open' : 'close'}`}>
          <NavLink to="/">
            <img src={Logo} alt="logo" className="logo" />
          </NavLink>
          <div className="hiddenLinks"></div>
        </div>
        <div className="rightSide">
quiz/tidy
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link> 
          {/* <Link to="/module">Module Pages</Link>  */}
          <Link to="/html">HTML</Link> 
          <Link to="/csscourse">CSS</Link> 
          <Link to="/javascript">JavaScript</Link>
          <Link to="/codesection">Code Snipet</Link>
          <Link to="/cheatsheets">Cheat Sheets</Link>
          <Link to="/quiz">QUIZ</Link>
          {/* Add more navbar links as needed */}

        </div>
      </nav>
    </div>
  );
}

export default Navbar;

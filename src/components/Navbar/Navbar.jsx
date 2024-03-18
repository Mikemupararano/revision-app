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
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
          <NavLink to="/about" activeClassName="active">About Us</NavLink>
          <NavLink to="/html" activeClassName="active">HTML</NavLink>
           <NavLink to="/csscourse" activeClassName="active">Quiz</NavLink>
          <NavLink to="/csscourse" activeClassName="active">CSS</NavLink>
          <NavLink to="/javascript" activeClassName="active">JavaScript</NavLink>
          <NavLink to="/codesection" activeClassName="active">Code Snippet</NavLink>
          <NavLink to="/cheatsheets" activeClassName="active">Cheat Sheets</NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

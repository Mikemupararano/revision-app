import React from 'react';
import './Footer.css';
// import GitHubIcon from '@mui/icons-material/GitHub';
//Github link for each member of the group
const Footer = () => {
  return (
    <div className="footer">
    
      <div className="socialMedia">
        <a href="https://github.com/Mikemupararano/revision-app" target="_blank" rel="noopener noreferrer">
          {/* <GitHubIcon /> */}
        </a>
         <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          {/* <GitHubIcon /> */}
        </a>
         <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          {/* <GitHubIcon /> */}
        </a>
         <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          {/* <GitHubIcon /> */}
        </a>
         <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          {/* <GitHubIcon /> */}
        </a>
        </div>
      <p>&copy; 2024 Team 8</p>
    </div>
  );
}

export default Footer;

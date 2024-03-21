import React from 'react';
import './About1.css';
import { FaGithub } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about">
      <div className="wrapper text-center">
        <h1>Our Team!</h1>
        <div className="team">
          <div className="person">
            <a href="https://github.com/Mikemupararano">
              <FaGithub />
              <p>Mike</p>
            </a>
          </div>
          <div className="person">
            <a href="https://github.com/designs-by-kate">
              <FaGithub />
              <p>Kate</p>
            </a>
          </div>
          <div className="person">
            <a href="https://github.com/christyl1992">
              <FaGithub />
              <p>Christy</p>
            </a>
          </div>
          <div className="person">
            <a href="https://github.com/Quarshie30">
              <FaGithub />
              <p>Eyram</p>
            </a>
          </div>
          <div className="person">
            <a href="https://github.com/Andreea-Lita">
              <FaGithub />
              <p>Andreea</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

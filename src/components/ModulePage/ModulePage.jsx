import React from 'react';
import { Link } from 'react-router-dom';
import Description from '../Description/Description';
import ProgressBar from '../ProgressBar/ProgressBar';
import CodeSection from '../CodeSection/CodeSection';
import axios from 'axios';
import './ModulePage.css'; // Import the CSS file for styling

function ModulePage({ scores }) {
  return (
    <div className="container-module mt-5">
      {/* Description and ProgressBar */}
      <div className="row">
        <div className="col description-section"> {/* Description takes 75% of the page */}
          <h1>Description</h1>
          <Description />
        </div>
      </div >
      <div className="row">
        <div className="col progressbar-section"> {/* ProgressBar takes 25% of the page */}
          <h1>Progress Bar</h1>
          <ProgressBar scores={scores} /> {/* Pass scores as props to ProgressBar component */}
        </div>
      </div>

      {/* CodeSnippet */}
      <div className="row">
        <div className="col codesnippet-section">
          <h1>Code snippet</h1>
          <CodeSection />
        </div>
      </div>

      {/* Tutorial, Cheatsheet, and Quiz */}
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-md tutorial-section">
              <h1>Tutorial</h1>
            </div>
            <div className="col-md cheatsheet-section">
              <h1>Cheat Sheets</h1>
            </div>
            <div className="col-md quiz-section">
              <h1>Quiz</h1>
              <Link to="/module/quiz">Take Quiz</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulePage;

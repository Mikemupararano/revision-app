// QuizStart.js
import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizStart() {
  const { handleGame, handleLanguageChange } = useContext(QuizContext);

  return (
      <div id="start" className="start-screen">
        <div>
          <h1>Coding Quiz Challenge</h1>
          <p>
            Try to answer the following code-related questions.
          </p>
        </div>
        <div className="languageOptions">
          <label id="languageText" htmlFor="language">Choose a language: </label>
          <select id="language" onChange={handleLanguageChange}>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
          </select>
        </div>
        <div>
          <button className="btn-small text-black" onClick={handleGame}>PLAY</button>
        </div>
      </div>
  );
}

export default QuizStart;

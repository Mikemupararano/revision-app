// QuizStart.js
import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizStart() {
  const { updateQuizStage, updateSelectedLanguage } = useContext(QuizContext);

  const handleStartQuiz = () => {
    updateQuizStage('GAME'); // Change quiz stage to 'GAME' when Start Quiz button is clicked
  };

  const handleLanguageChange = (e) => {
    updateSelectedLanguage(e.target.value); // Update selected language
  };

  return (
    <div className="wrapper">
      <div id="start-screen" className="start">
        <div>
          <h1 className="text-danger">Coding Quiz Challenge</h1>
          <p>
            Try to answer the following code-related questions within the time limit.
          </p>
          <p>
            Keep in mind that incorrect answers will penalize your score/time by ten seconds!
          </p>
        </div>
        <div className="languageOptions">
          <label id="languageText" className="text-danger" htmlFor="language">Choose a language: </label>
          <select id="language" onChange={handleLanguageChange}>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
          </select>
        </div>
        <div>
          <button className="btn-small text-black" onClick={handleStartQuiz}>PLAY</button>
        </div>
      </div>
    </div>
  );
}

export default QuizStart;

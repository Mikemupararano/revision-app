import React, { useContext, useEffect, useState } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function Progress() {
  const { onRestartQuiz, onExit } = useContext(QuizContext); // Access onRestartQuiz and onExit functions from context

  // State to store scores and total questions for each language
  const [scores, setScores] = useState({
    html: { score: 0, totalQuestions: 0 },
    css: { score: 0, totalQuestions: 0 },
    js: { score: 0, totalQuestions: 0 }
  });

  // Effect to load data from local storage on component mount
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quizResult'));
    if (data) {
      // Update only the existing scores
      setScores(prevScores => ({
        ...prevScores,
        ...data
      }));
    }
  }, []);

  // Function to calculate the percentage progress for a language
  const calculatePercentage = (language) => {
    const { score = 0, totalQuestions = 0 } = scores[language] || {}; // Handle undefined language score data
    return totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  };

  // Render the Progress component
  return (
    <div className="progress-container">
      {/* Header displaying the title of the progress */}
      <h2 className="text-danger">Quiz Progress</h2>
      {/* Progress bars for each language */}
      <div className="container">
        <div className="progress-item">
          <h3>HTML Progress: {calculatePercentage('html')}%</h3>
          <div className="progress">
            <div
              className="progress-bar progress-bar-html"
              role="progressbar"
              style={{ width: `${calculatePercentage('html')}%` }}
              aria-valuenow={calculatePercentage('html')}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <div className="progress-item">
          <h3>CSS Progress: {calculatePercentage('css')}%</h3>
          <div className="progress">
            <div
              className="progress-bar progress-bar-css"
              role="progressbar"
              style={{ width: `${calculatePercentage('css')}%` }}
              aria-valuenow={calculatePercentage('css')}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <div className="progress-item">
          <h3>JavaScript Progress: {calculatePercentage('js')}%</h3>
          <div className="progress">
            <div
              className="progress-bar progress-bar-js"
              role="progressbar"
              style={{ width: `${calculatePercentage('js')}%` }}
              aria-valuenow={calculatePercentage('js')}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>

      {/* Buttons to restart the quiz or exit */}
      <div className="progress-buttons">
        <button className="btn-small text-black" onClick={onRestartQuiz}>PLAY AGAIN</button>
        <button className="btn-exit" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

export default Progress;

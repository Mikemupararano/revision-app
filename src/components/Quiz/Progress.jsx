import React, { useContext, useEffect, useState } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function Progress() {
  const { handleStart } = useContext(QuizContext);

  // State to store scores and total questions for each language
  const [scores, setScores] = useState({
    html: { score: 0, totalQuestions: 0 },
    css: { score: 0, totalQuestions: 0 },
    js: { score: 0, totalQuestions: 0 }
  });

 // Effect to load data from local storage on component mount
useEffect(() => {
  const data = JSON.parse(localStorage.getItem('quizResults')); // Retrieve data from local storage
  if (data) {
      // Initialize scores with default values
      const defaultScores = {
          html: { score: 0, totalQuestions: 0 },
          css: { score: 0, totalQuestions: 0 },
          js: { score: 0, totalQuestions: 0 }
      };

      // Update scores based on retrieved data
      const updatedScores = data.reduce((acc, result) => {
          const { selectedLanguage, score, numberOfQuestions } = result;
          if (selectedLanguage && acc[selectedLanguage]) {
              acc[selectedLanguage] = { score, totalQuestions: numberOfQuestions };
          }
          return acc;
      }, defaultScores);

      setScores(updatedScores);
  }
}, []);

  // Function to calculate the percentage progress for a language
  const calculatePercentage = (language) => {
    // Destructure the score and totalQuestions properties from the scores object corresponding to the provided language.
    // If scores[language] is undefined, default to an empty object to prevent errors.
    const { score = 0, totalQuestions = 0 } = scores[language] || {};
    // Calculate the percentage progress by dividing the score by the total number of questions and multiplying by 100.
    // If totalQuestions is 0 (to avoid division by zero), return 0 as the percentage.
    return totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  };

  // Render the Progress component
  return (
    <div className="progress-screen">
        {/* Header displaying the title of the progress */}
        <h1>Quiz Progress</h1>

        {/* Progress bars for each language */}
        <div className="container">
            {Object.keys(scores).map(language => (
                <div className="progress-item" key={language}>
                    <h3>{language.toUpperCase()} Progress: {calculatePercentage(language)}%</h3>
                    <div className="progress">
                        <div
                            className={`progress-bar progress-bar-${language}`}
                            role="progressbar"
                            style={{ width: `${calculatePercentage(language)}%` }}
                            aria-valuenow={calculatePercentage(language)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Display a placeholder if no data is retrieved */}
        {Object.keys(scores).length === 0 && (
            <div>No score data retrieved from local storage.</div>
        )}

        {/* Buttons to restart the quiz or exit */}
        <div className="progress-buttons">
            <button className="btn-small text-black" onClick={handleStart}>PLAY AGAIN</button>
        </div>
    </div>
);
}

export default Progress;

import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = () => {
  const [scores, setScores] = useState({
    html: { score: 0, totalQuestions: 0 },
    css: { score: 0, totalQuestions: 0 },
    js: { score: 0, totalQuestions: 0 }
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quizResults')); // Retrieve data from local storage
    if (data) {
      const defaultScores = {
        html: { score: 0, totalQuestions: 0 },
        css: { score: 0, totalQuestions: 0 },
        js: { score: 0, totalQuestions: 0 }
      };

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

  return (
    <div className="probar" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      {Object.keys(scores).map((language, index) => (
        <div key={language} style={{ marginBottom: '20px'}}>
          <h3>{language.toUpperCase()}</h3>
          <div style={{ width: 200 }}>
            <CircularProgressbar
              value={(scores[language].score / scores[language].totalQuestions) * 100}
              text={`${scores[language].score}/${scores[language].totalQuestions}`}
              styles={buildStyles({
                pathColor: index === 0 ? '#393536' : index === 1 ? '#218575' : '#ff680a',
                textColor: index === 0 ? '#393536' : index === 1 ? '#218575' : '#ff680a',
                trailColor: '',
              })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
import React, { useState } from 'react';
import './Quiz.css';

function QuizStart({ onPlay }) {
    const [selectedLanguage, setSelectedLanguage] = useState('html');

    const handleStartQuiz = () => {
        onPlay(selectedLanguage);
    }

    return (
    <div className="wrapper">
        <div id="start-screen" className="start">
            <h1>Coding Quiz Challenge</h1>
            <p>
            Try to answer the following code-related questions within the time limit.
            Keep in mind that incorrect answers will penalize your score/time by ten seconds!
          </p>
            <label htmlFor="language">Choose a language:</label>
            <select id="language" onChange={(e) => setSelectedLanguage(e.target.value)}>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
            </select>
            <button className="btn-primary" onClick={handleStartQuiz}>PLAY</button>
        </div>
    </div>
    );
}

export default QuizStart;

// QuizEnd.js
import React from 'react';
import './Quiz.css';

function QuizEnd({ onExit, onShowProgress, onRestartQuiz, selectedLanguage}) {
    const handleFinishGame = () => {
        const quizResult = {
            selectedLanguage
        };
        localStorage.setItem('quizResult', JSON.stringify(quizResult));
        onShowProgress(); // Call onShowProgress function passed as prop
    };

    return (
        <div className="quiz-end">
            <h1>Quiz Finish !</h1>
            <button className="btn-primary" onClick={handleFinishGame}>SAVE</button>
            <button className="btn-primary" onClick={onRestartQuiz}>PLAY AGAIN</button>
            <button className="btn-primary" onClick={onShowProgress}>PROGRESS</button>
            <button className="btn-primary" onClick={onExit}>EXIT</button>
        </div>
    );
}

export default QuizEnd;

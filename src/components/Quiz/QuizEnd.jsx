// QuizEnd.js
import React from 'react';
import './Quiz.css';

function QuizEnd({ onExit, onShowProgress, onRestartQuiz, selectedLanguage}) {
    const handleFinishGame = () => {
        const quizResult = {
            selectedLanguage,
        };
        localStorage.setItem('quizResult', JSON.stringify(quizResult));
        onShowProgress(); // Call onShowProgress function passed as prop
    };

    return (
        <div className="quiz-end">
            <h1 className="text-danger">Quiz Finish !</h1>
            <button className="btn-small text-black" onClick={handleFinishGame}>SAVE</button>
            <button className="btn-small text-black" onClick={onRestartQuiz}>PLAY AGAIN</button>
            <button className="btn-small text-black" onClick={onShowProgress}>PROGRESS</button>
            <button className="btn-exit" onClick={onExit}>EXIT</button>
        </div>
    );
}

export default QuizEnd;

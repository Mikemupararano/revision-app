// QuizEnd.js
import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizEnd() {
    const { handleExit, handleShowProgress, handleRestartQuiz, selectedLanguage } = useContext(QuizContext);

    const handleFinishGame = () => {
        const quizResult = {
            selectedLanguage,
        };
        localStorage.setItem('quizResult', JSON.stringify(quizResult));
        handleShowProgress(); // Call handleShowProgress function from context
    };

    return (
        <div className="quiz-end">
            <h1 className="text-danger">Quiz Finish !</h1>
            <button className="btn-small text-black" onClick={handleFinishGame}>SAVE</button>
            <button className="btn-small text-black" onClick={handleRestartQuiz}>PLAY AGAIN</button>
            <button className="btn-small text-black" onClick={handleShowProgress}>PROGRESS</button>
            <button className="btn-exit" onClick={handleExit}>EXIT</button>
        </div>
    );
}

export default QuizEnd;

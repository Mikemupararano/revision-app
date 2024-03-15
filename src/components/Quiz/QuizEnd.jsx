import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizEnd({ score, numberOfQuestions, selectedLanguage }) {
    const { handleProgress, handleStart } = useContext(QuizContext);

    const handleFinishGame = () => {
        const quizResult = {
            id: Date.now(), // Unique identifier for the quiz result
            selectedLanguage,
            score,
            numberOfQuestions, // Include the total number of questions
        };
        const storedResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        
        // Check if there's already a stored result for the selected language
        const existingResultIndex = storedResults.findIndex(result => result.selectedLanguage === selectedLanguage);
        if (existingResultIndex !== -1) {
            // Compare scores and update only if the new score is higher
            if (score > storedResults[existingResultIndex].score) {
                storedResults[existingResultIndex] = quizResult;
                localStorage.setItem('quizResults', JSON.stringify(storedResults));
            }
        } else {
            // No existing result for the selected language, save the new result
            storedResults.push(quizResult);
            localStorage.setItem('quizResults', JSON.stringify(storedResults));
        }
    
        handleProgress(); // Call handleShowProgress function from context
    };

    return (
        <div className="end-screen">
            <div className="summary">
                <h1>Quiz Summary</h1>
                <p>Your score: {score} out of {numberOfQuestions}</p>
            </div>
            <div className="quiz-end">
                <button className="btn-small text-black" onClick={handleFinishGame}>SAVE</button>
                <button className="btn-small text-black" onClick={handleStart}>PLAY AGAIN</button>
                <button className="btn-small text-black" onClick={handleProgress}>PROGRESS</button>
            </div>
        </div>
    );
}

export default QuizEnd;

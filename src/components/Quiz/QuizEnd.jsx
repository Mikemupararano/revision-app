import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizEnd({ numberOfQuestions, selectedLanguage }) {
    const { handleProgress, handleStart, score } = useContext(QuizContext);

    const handleFinishGame = () => {
        // Create an object representing the quiz result
        const quizResult = {
            id: Date.now(), // Unique identifier for the quiz result
            selectedLanguage, // The language selected for the quiz
            score, // The score achieved in the quiz
            numberOfQuestions, // The total number of questions in the quiz
        };
        // Retrieve previously stored quiz results from local storage, or initialize an empty array
        const storedResults = JSON.parse(localStorage.getItem('quizResults')) || [];

        // Check if there's already a stored result for the selected language
        const existingResultIndex = storedResults.findIndex(result => result.selectedLanguage === selectedLanguage);
        // If there's already a stored result for the selected language
        if (existingResultIndex !== -1) {
            // Compare scores and update only if the new score is higher
            if (score > storedResults[existingResultIndex].score) {
                storedResults[existingResultIndex] = quizResult; // Update the existing result with the new one
                localStorage.setItem('quizResults', JSON.stringify(storedResults)); // Store the updated results back to local storage
            }
        } else {
            // No existing result for the selected language, save the new result
            storedResults.push(quizResult);
            localStorage.setItem('quizResults', JSON.stringify(storedResults)); // Store the new result in local storage
        }

        handleProgress(); // Call handleShowProgress function from context
    };

    return (
        <div className="end-screen">
            <div className="summary">
                <h1>Quiz Summary</h1>
                <h2>Your score: {score} out of {numberOfQuestions}</h2>
            </div>
            <div className="end-button">
                <button className="btn-small text-black" onClick={handleFinishGame}>SAVE</button>
                <button className="btn-small text-black" onClick={handleStart}>PLAY AGAIN</button>
            </div>
        </div>
    );
}

export default QuizEnd;
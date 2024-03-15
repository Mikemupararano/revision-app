import React, { useContext, useState } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';
import questions from '../../data/quiz.json';
import Question from './Question';
import QuizEnd from './QuizEnd';

function QuizGame() {
    const { handleEnd, selectedLanguage, setScore } = useContext(QuizContext);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
    const [answerFeedback, setAnswerFeedback] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [score, setLocalScore] = useState(0); // State to store the score locally

    // Filter questions based on selectedLanguage
    const filteredQuestions = questions.filter(question => selectedLanguage === 'all' || question.language === selectedLanguage);

    const handleAnswerClick = (selectedOption) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = selectedOption;
        setUserAnswers(updatedAnswers);

        const correctAnswerIndex = filteredQuestions[currentQuestionIndex].answerOptions.findIndex(option => option.isCorrect);
        if (selectedOption === filteredQuestions[currentQuestionIndex].answerOptions[correctAnswerIndex].answerText) {
            setAnswerFeedback('Correct!');
        } else {
            setAnswerFeedback('Wrong!');
        }

    };

    const handleNextButtonClick = () => {
        const nextQuestionIndex = currentQuestionIndex + 1;

        if (nextQuestionIndex < filteredQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setAnswerFeedback(''); // Reset answer feedback when moving to the next question
        } else {
            setShowSummary(true);
            const score = calculateScore(); // Calculate the score
            setLocalScore(score); // Update the local score state
            setScore(score); // Update the score in the context
        }
    };

    const handlePreviousButtonClick = () => {
        const prevQuestionIndex = currentQuestionIndex - 1;

        if (prevQuestionIndex >= 0) {
            setCurrentQuestionIndex(prevQuestionIndex);
        }
    };

    const calculateScore = () => {
        let score = 0;

        for (let i = 0; i < filteredQuestions.length; i++) {
            const correctAnswerIndex = filteredQuestions[i].answerOptions.findIndex(option => option.isCorrect);
            if (userAnswers[i] === filteredQuestions[i].answerOptions[correctAnswerIndex].answerText) {
                score++;
            }
        }

        return score;
    };

    return (
        <>
            <div className="quiz-game">
                <h1>Game</h1>
                <div className="container mt-sm-5 my-1">
                    {showSummary ? (
                        <QuizEnd
                        score={score} // Make sure this prop is correctly passed
                        numberOfQuestions={filteredQuestions.length}
                        selectedLanguage={selectedLanguage}
                    />
                    ) : (
                        <Question
                            question={filteredQuestions[currentQuestionIndex]}
                            currentQuestionIndex={currentQuestionIndex}
                            userAnswers={userAnswers}
                            handleAnswerClick={handleAnswerClick}
                            handlePreviousButtonClick={handlePreviousButtonClick}
                            handleNextButtonClick={handleNextButtonClick}
                            isLastQuestion={currentQuestionIndex === filteredQuestions.length - 1}
                        />
                    )}
                </div>
                <div className="buttonsQG">
                    <button className="btn-small text-black" onClick={handleEnd}>FINISH</button>
                </div>
            </div>
        </>
    );
}

export default QuizGame;

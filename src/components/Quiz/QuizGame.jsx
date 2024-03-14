import React, { useState } from 'react';
import './Quiz.css';
import questions from '../../data/quiz.json';
import Question from './Question';

function QuizGame({ onFinish, onExit, selectedLanguage }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
    const [answerFeedback, setAnswerFeedback] = useState('');
    const [showSummary, setShowSummary] = useState(false);

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
        }
    };

    const handlePreviousButtonClick = () => {
        const prevQuestionIndex = currentQuestionIndex - 1;

        if (prevQuestionIndex >= 0) {
            setCurrentQuestionIndex(prevQuestionIndex);
        }
    };

    const handleExit = () => {
        onExit();
    };

    const handleFinish = () => {
        onFinish();
        setCurrentQuestionIndex(0);
        setUserAnswers(Array(questions.length).fill(null));
        setShowSummary(false);
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

    return (<>
      <div className="quiz-game">
        <h1 className="text-danger">Game</h1>
        <p>Chosen Language: {selectedLanguage}</p>
        <div className="container mt-sm-5 my-1">
          {showSummary ? (
            <div className="summary">
              <h2>Quiz Summary</h2>
              <p>Your score: {calculateScore()} out of {filteredQuestions.length}</p>
            </div>
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
          <button className="btn-small text-black" onClick={handleFinish}>FINISH</button>
          <button className="btn-exit" onClick={handleExit}>EXIT</button>
        </div>
      </div>
    </>
  );
}

export default QuizGame;

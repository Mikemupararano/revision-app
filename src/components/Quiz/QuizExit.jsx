import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizExit() {
  const { updateQuizStage } = useContext(QuizContext); // Access updateQuizStage function from context

  const handleStartQuiz = () => {
    updateQuizStage('START'); // Change quiz stage to 'START' when Start Quiz button is clicked
  };

  return (
    <div className="quiz-exit">
      <h1 className="text-danger">Welcome to the Quiz!</h1>
      <p>Click the button below to start the quiz.</p>
      <button className="btn-small text-black" onClick={handleStartQuiz}>START QUIZ</button>
    </div>
  );
}

export default QuizExit;

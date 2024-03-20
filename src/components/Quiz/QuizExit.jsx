import React, { useContext } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';

function QuizExit() {
  const { handleStart } = useContext(QuizContext);


  return (
    <div className="quiz-exit">
      <h1 >Welcome to the Quiz!</h1>
      <p>Click the button below to start the quiz.</p>
      <button className="btn-small text-black" onClick={handleStart}>START QUIZ</button>
    </div>
  );
}

export default QuizExit;
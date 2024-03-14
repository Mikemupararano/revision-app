// Quiz.js
import React, { useState } from 'react';
import './Quiz.css';
import QuizStart from './QuizStart';
import QuizGame from './QuizGame';
import QuizEnd from './QuizEnd';
import Progress from './Progress';

function Quiz() {
  const [showStart, setShowStart] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('html');

  const handleWelcome = () => {
    setShowStart(true);
    setShowGame(false);
    setShowEnd(false);
    setShowProgress(false);
  };
  
  const handleStartQuiz = (language) => {
    setSelectedLanguage(language);
    setShowStart(false);
    setShowGame(true);
    setShowEnd(false);
    setShowProgress(false);
  };

  const handleFinishGame = () => {
    setShowStart(false);
    setShowGame(false);
    setShowEnd(true);
    setShowProgress(false);
  };

  const handleShowProgress = () => {
    setShowStart(false);
    setShowGame(false);
    setShowEnd(false);
    setShowProgress(true);
  };

  const handleRestartQuiz = (language) => {
    setSelectedLanguage(language);
    setShowStart(true);
    setShowGame(false);
    setShowEnd(false);
    setShowProgress(false);
  };

  return (
    <>
      <button className="btn-primary" onClick={handleWelcome}>START QUIZ</button>
      <div className="quiz-container">
        {showStart && <QuizStart onPlay={handleStartQuiz} />}
        {showGame && <QuizGame onFinish={handleFinishGame} onExit={handleWelcome} selectedLanguage={selectedLanguage} />}
        {showEnd && <QuizEnd onExit={handleWelcome} onShowProgress={handleShowProgress} onRestartQuiz={handleRestartQuiz} selectedLanguage={selectedLanguage} />}
        {showProgress && <Progress onRestartQuiz={handleRestartQuiz} onExit={handleWelcome} onShowProgress={handleShowProgress} />} {/* Add onShowProgress prop here */}
      </div>
    </>
  );
}

export default Quiz;

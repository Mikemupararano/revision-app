// QuizContext.js
import React, { createContext, useState, useEffect } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  //STAGE
  const [quizStage, setQuizStage] = useState(() => {
    const storedStage = localStorage.getItem('quizStage');
    return storedStage ? storedStage : 'EXIT'; // Default to 'EXIT' if no stage is stored
  });
  useEffect(() => {
    localStorage.setItem('quizStage', quizStage);
  }, [quizStage]);

  //LANGUAGE
  const [selectedLanguage, setSelectedLanguage] = useState('html'); // Default selected language is HTML

  //SCORE
  const [score, setScore] = useState(0); // State to store the score

  //Function to update LANGUAGE
  const updateSelectedLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const handleLanguageChange = (e) => {
    updateSelectedLanguage(e.target.value); // Update selected language
  };

  // Function to update STAGE
  const updateQuizStage = (newStage) => {
    setQuizStage(newStage);
  };

  //BUTTONS functionality
  const handleStart = () => {
    setQuizStage('START');
  };
  const handleGame = () => {
    setQuizStage('GAME');
  };
  const handleEnd = () => {
    setQuizStage('END');
  };
  const handleProgress = () => {
    setQuizStage('PROGRESS');
  };

  // Context value
  const contextValue = {
    quizStage,
    updateQuizStage,
    selectedLanguage,
    updateSelectedLanguage,
    handleLanguageChange,
    handleStart,
    handleGame,
    handleEnd,
    handleProgress,
    score,
    setScore,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};
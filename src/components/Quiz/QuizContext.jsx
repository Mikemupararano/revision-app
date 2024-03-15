// QuizContext.js
import React, { createContext, useState, useEffect } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizStage, setQuizStage] = useState(() => {
    const storedStage = localStorage.getItem('quizStage');
    return storedStage ? storedStage : 'EXIT'; // Default to 'EXIT' if no stage is stored
  });
  useEffect(() => {
    localStorage.setItem('quizStage', quizStage);
  }, [quizStage]);

  const [selectedLanguage, setSelectedLanguage] = useState('html'); // Default selected language is HTML

  // Function to update quiz stage
  const updateQuizStage = (newStage) => {
    setQuizStage(newStage);
  };

  const updateSelectedLanguage = (language) => {
    setSelectedLanguage(language);
  };

  const handleExit = () => {
    setQuizStage('EXIT');
};

const handleShowProgress = () => {
    setQuizStage('PROGRESS');
};

const handleRestartQuiz = () => {
    setQuizStage('START');
};

  // Context value
  const contextValue = {
    quizStage,
    updateQuizStage,
    selectedLanguage,
    updateSelectedLanguage,
    handleExit,
    handleShowProgress,
    handleRestartQuiz
    };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

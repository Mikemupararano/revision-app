
import React, { useContext } from 'react';
import QuizStart from './QuizStart';
import QuizGame from './QuizGame';
import QuizEnd from './QuizEnd';
import Progress from './Progress';
import QuizExit from './QuizExit'; // Import the QuizExit component
import { QuizContext } from './QuizContext';

import './Quiz.css';

function Quiz() {
  const { quizStage, updateQuizStage } = useContext(QuizContext); // Accessing context

  // Function to handle exit and set quiz stage to 'EXIT'
  const handleExit = () => {
    updateQuizStage('EXIT');
  };

  // Render components based on quiz stage
  let componentToRender;
  switch (quizStage) {
    case 'EXIT':
      componentToRender = <QuizExit />;
      break;
    case 'START':
      componentToRender = <QuizStart />;
      break;
    case 'GAME':
      componentToRender = <QuizGame />;
      break;
    case 'END':
      componentToRender = <QuizEnd />;
      break;
    case 'PROGRESS':
      componentToRender = <Progress />;
      break;
    default:
      componentToRender = null;
  }

  return (
    <>
      {componentToRender}
      {quizStage !== 'EXIT' && (
        <button className="btn-exit" onClick={handleExit}>EXIT</button>
      )}
    </>
  );
}

export default Quiz;


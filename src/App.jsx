import React from 'react';
import Quiz from './components/Quiz/Quiz';
import { QuizProvider } from './components/Quiz/QuizContext';

function App() {
  return (
    <QuizProvider>
      <Quiz />
    </QuizProvider>
  );
}

export default App;
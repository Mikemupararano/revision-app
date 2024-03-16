import React from 'react';
import { render, screen } from '@testing-library/react';
import * as userEvent from '@testing-library/user-event';
import Quiz from '../../src/components/Quiz/Quiz'
import { QuizContext } from '../../src/components/Quiz/QuizContext'
import '../setup';

// Initial context values for testing
const initialContext = {
  quizStage: 'START', // Initial quiz stage
  updateQuizStage: () => {}, // Mock function for updating quiz stage
};

it('Quiz Component Renders Without Error', () => {
  render(
    <QuizContext.Provider value={initialContext}>
      <Quiz />
    </QuizContext.Provider>
  );
});

it('Quiz Component Renders Quiz Start Section', () => {
  render(
    <QuizContext.Provider value={{ ...initialContext, quizStage: 'START' }}>
      <Quiz />
    </QuizContext.Provider>
  );
  expect(screen.getByText('Quiz Start')).toBeInTheDocument();
});

it('Clicking EXIT button triggers handleExit function', () => {
  const updateQuizStage = jest.fn(); // Mock function for updating quiz stage
  render(
    <QuizContext.Provider value={{ ...initialContext, updateQuizStage }}>
      <Quiz />
    </QuizContext.Provider>
  );
  userEvent.click(screen.getByText('EXIT'));
  expect(updateQuizStage).toHaveBeenCalledWith('EXIT');
});

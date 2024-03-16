// Quiz.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '../../src/components/Quiz/Quiz'
import { QuizContext } from '../../src/components/Quiz/QuizContext'

// Mock QuizContext for testing
const mockContext = {
  quizStage: 'START', // Initial quiz stage
  updateQuizStage: jest.fn(), // Mock function for updating quiz stage
};

test('Quiz Component Renders Without Error', () => {
  render(
    <QuizContext.Provider value={mockContext}>
      <Quiz />
    </QuizContext.Provider>
  );
});

test('Correct Component is Rendered Based on Quiz Stage', () => {
  // Test case 1: Render QuizStart component if quiz stage is 'START'
  render(
    <QuizContext.Provider value={{ ...mockContext, quizStage: 'START' }}>
      <Quiz />
    </QuizContext.Provider>
  );
  expect(screen.getByText('Quiz Start')).toBeInTheDocument(); // Adjust this assertion based on your QuizStart component

  // You can add similar test cases for other quiz stages (GAME, END, PROGRESS, etc.)
});

test('Clicking EXIT button triggers handleExit function', () => {
  render(
    <QuizContext.Provider value={mockContext}>
      <Quiz />
    </QuizContext.Provider>
  );
  const exitButton = screen.getByText('EXIT');
  fireEvent.click(exitButton);
  expect(mockContext.updateQuizStage).toHaveBeenCalledWith('EXIT');
});

import React, { useContext, useState } from 'react';
import { QuizContext } from './QuizContext';
import './Quiz.css';
import questions from '../../data/quiz.json';
import Question from './Question';
import QuizEnd from './QuizEnd';
import { toast } from 'react-hot-toast';

function QuizGame() {
    const { handleEnd, selectedLanguage, score, setScore } = useContext(QuizContext);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));// Initialize state to hold user answers for each question, initially filled with null values, using the number of questions obtained from the 'questions' array.
    const [answerFeedback, setAnswerFeedback] = useState('');
    const [showSummary, setShowSummary] = useState(false);

    // Filter questions based on selectedLanguage
    const filteredQuestions = questions.filter(question => question.language === selectedLanguage);

    const handleAnswerClick = (selectedOption) => {
        // Make a copy of the current userAnswers array
        const updatedAnswers = [...userAnswers];
        // Update the answer for the current question with the selected option
        updatedAnswers[currentQuestionIndex] = selectedOption;
        // Update the state with the new answers array
        setUserAnswers(updatedAnswers);
        // Find the index of the correct answer in the current question's answerOptions
        const correctAnswerIndex = filteredQuestions[currentQuestionIndex].answerOptions.findIndex(option => option.isCorrect);
        // Check if the selected option matches the correct answer
        if (selectedOption === filteredQuestions[currentQuestionIndex].answerOptions[correctAnswerIndex].answerText) {
            // If the selected option is correct, set the answer feedback to 'Correct!'
            setAnswerFeedback('Correct!');
            toast.success('Well done! Your answer is correct.', {
                icon: '👏', style: {
                    border: '5px solid rgb(255, 174, 0)',
                  },
                })
        } else {
            // If the selected option is incorrect, set the answer feedback to 'Wrong!'
            setAnswerFeedback('Wrong!');
            toast.error('Oops! Wrong answer.', {
                style: {
                  border: '5px solid red',
                },
              });
        }
    };

    const handleNextButtonClick = () => {
        const nextQuestionIndex = currentQuestionIndex + 1;

        if (nextQuestionIndex < filteredQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setAnswerFeedback(''); // Reset answer feedback when moving to the next question
        } else {
            //when no more question available
            setShowSummary(true);
            const score = calculateScore(); // Calculate the score
            setScore(score); // Update the score in the context
        }
    };

    const handlePreviousButtonClick = () => {
        const prevQuestionIndex = currentQuestionIndex - 1;

        if (prevQuestionIndex >= 0) {
            setCurrentQuestionIndex(prevQuestionIndex);
        }
    };

    const calculateScore = () => {
        let score = 0; // Initialize the score to zero
        // Loop through each question in the filteredQuestions array
        for (let i = 0; i < filteredQuestions.length; i++) {
            // Find the index of the correct answer for the current question
            const correctAnswerIndex = filteredQuestions[i].answerOptions.findIndex(option => option.isCorrect);
            // Check if the user's answer for the current question matches the correct answer
            if (userAnswers[i] === filteredQuestions[i].answerOptions[correctAnswerIndex].answerText) {
                // If the user's answer is correct, increment the score by 1
                score++;
            }
        }
        // Update the global score using setScore
        setScore(score);
        // Return the final score after checking all questions
        return score;
    };

    return (
    <div className="quiz-game">
        <h1>Game</h1>
        <div className="game-container">
            {showSummary ? (
                <QuizEnd
                    numberOfQuestions={filteredQuestions.length}
                    selectedLanguage={selectedLanguage}
                />
                ) : (
                <Question
                    question={filteredQuestions[currentQuestionIndex]}
                    currentQuestionIndex={currentQuestionIndex}
                    userAnswers={userAnswers}
                    feedback={answerFeedback}
                    handleAnswerClick={handleAnswerClick}
                    handlePreviousButtonClick={handlePreviousButtonClick}
                    handleNextButtonClick={handleNextButtonClick}
                    isLastQuestion={currentQuestionIndex === filteredQuestions.length - 1}
                />
            )}
        </div>
        <div className="buttonsQG">
            <button className="btn-small text-black" onClick={handleEnd}>FINISH</button>
        </div>
    </div>
    );
}

export default QuizGame;
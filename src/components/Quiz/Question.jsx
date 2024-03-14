import React, { useState } from 'react';

const Question = ({ question, currentQuestionIndex, handleAnswerClick, userAnswers, handlePreviousButtonClick, handleNextButtonClick, isLastQuestion }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (optionText) => {
    setSelectedOption(optionText);
    handleAnswerClick(optionText);
  };

  const isAnswerSelected = userAnswers[currentQuestionIndex] !== null;

  return (
    <div className="question ml-sm-5 pl-sm-5 pt-2">
      <div className="py-2 h5">
        <b>{question.language.toUpperCase()} Question</b>
      </div>
      <div className="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
        <div>{question.questionText}</div>
        {question.answerOptions.map((option, index) => (
          <label key={index} className="options" style={{ color: userAnswers[currentQuestionIndex] === option.answerText ? (option.isCorrect ? 'green' : 'red') : 'inherit' }}>
            {option.answerText}
            <input
              type="radio"
              name="radio"
              onClick={() => handleOptionClick(option.answerText)}
              checked={selectedOption === option.answerText}
              disabled={isAnswerSelected} // Disable radio button if an answer is already selected
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
      <div className="d-flex align-items-center pt-3">
        <div id="prev">
          <button className="btn btn-primary" onClick={handlePreviousButtonClick} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
        </div>
        <div className="ml-auto mr-sm-5">
          {isLastQuestion ? (
            <button className="btn btn-success" onClick={handleNextButtonClick}>
              Finish
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleNextButtonClick}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;

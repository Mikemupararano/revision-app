import React from 'react';

const Question = ({ question, currentQuestionIndex, handleAnswerClick, userAnswers, feedback, handlePreviousButtonClick, handleNextButtonClick, isLastQuestion }) => {
  // Check if an answer has been selected for the current question
  const isAnswerSelected = userAnswers[currentQuestionIndex] !== null;

  return (
    <div className="question ml-sm-5 pl-sm-5 pt-2">
      <div className="qLangAndNum py-2 h5 ">
        <h2>{question.language.toUpperCase()} Question {currentQuestionIndex} / 10</h2>
      </div>
      <div className="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
        <div className="questionText">
        <h1>{question.questionText}</h1>
        </div>
        {question.answerOptions.map((option, index) => (
          <label key={index} className="options" style={{ color: userAnswers[currentQuestionIndex] === option.answerText ? (option.isCorrect ? '#218575' : 'red') : 'inherit' }}>
            {option.answerText}
            <input
              type="radio"
              name="radio"
              onClick={() => handleAnswerClick(option.answerText)}
              checked={userAnswers[currentQuestionIndex] === option.answerText}
              disabled={isAnswerSelected} // Disable radio button if an answer is already selected
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
      <div className="buttonQ pt-3">
        <div id="prev">
          <button className="btn-small"  style={{ color: '#218575' }} onClick={handlePreviousButtonClick} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
        </div>
        <div className="ml-auto mr-sm-5">
          {isLastQuestion ? (
            <button className="btn-small" style={{ color: '#218575' }} onClick={handleNextButtonClick}>
              Finish
            </button>
          ) : (
            <button className="btn-small" style={{ color: '#ff680a' }} onClick={handleNextButtonClick}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
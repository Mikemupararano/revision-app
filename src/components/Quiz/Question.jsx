import React from 'react';

const Question = ({ question, currentQuestionIndex, handleAnswerClick, userAnswers, handlePreviousButtonClick, handleNextButtonClick, isLastQuestion }) => {
  const isAnswerSelected = userAnswers[currentQuestionIndex] !== null;

  return (
    <div className="question ml-sm-5 pl-sm-5 pt-2">
      <div className="py-2 h5 ">
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
              onClick={() => handleAnswerClick(option.answerText)}
              checked={userAnswers[currentQuestionIndex] === option.answerText}
              disabled={isAnswerSelected} // Disable radio button if an answer is already selected
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
      <div className="buttonsQ pt-3">
        <div id="prev">
          <button className="btn-small text-black align-items-left" onClick={handlePreviousButtonClick} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
        </div>
        <div className="ml-auto mr-sm-5 align-items-right ">
          {isLastQuestion ? (
            <button className="btn-exit text-black" onClick={handleNextButtonClick}>
              Finish
            </button>
          ) : (
            <button className="btn-small text-danger " onClick={handleNextButtonClick}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;

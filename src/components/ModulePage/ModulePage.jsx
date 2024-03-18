import React from 'react';
import Progress from '../Progress/Progress';
import Tutorial from '../Tutorial/Tutorial';
import Quiz from '../Quiz/Quiz';
import CheatSheets from '../CheatSheets/CheatSheets';
import CodeSection from '../CodeSection/CodeSection';
import Description from '../Description/Description';
import HTML from '../HTML-course/HTML';
import CSSCourse from '../CSS-course/CSSCourse'; // Corrected import statement
import JavaScript from '../JavaScript/JavaScript';
import QuizImage from '../../assets/HtmlImage.png';
import ProgressImage from '../../assets/progressImage.png';
import CodeSnippet from '../../assets/codeSnippetImage.png';
import './ModulePage.css';

const ModulePage = () => {(
  // const workData = [
  //   {
  //     image: QuizImage,
  //     title: "HTML Quiz",
  //     text: "Click on the button above to start the quiz.",
  //   },
  //   {
  //     image: ProgressImage,
  //     title: "Quiz Progress",
  //     text: "Your progress is shown on the progress chart.",
  //   },
  //   {
  //     image: CodeSnippet,
  //     title: "Code Section",
  //     text: "Write your HTML code in the section above.",
  //   },
  // ];

  // return (
  //   <div className="work-section-wrapper">
  //     <div className="quiz-section-top">
  //       <p className="primary-heading">Quiz</p>
  //       <h1 className="primary-heading">How It Works</h1>
  //       <p className="primary-text">
  //         Here is a quiz for you!
  //       </p>
  //     </div>
  //     <div className="work-section-bottom">
  //       {workData.map((data) => (
  //         <div className="work-section-info" key={data.title}>
  //           <div className="info-boxes-img-container">
  //             <img src={data.image} alt="" />
  //           </div>
  //           <h2>{data.title}</h2>
  //           <p>{data.text}</p>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  );
};

export default ModulePage;


// import React from 'react';
// import TutorialVideo from "./components/Tutorial/Tutorial";
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <div className="container">
//       <h1>Youtube Tutorials</h1>
//       <div className="row">
//         <div className="col-md-4">
//           <TutorialVideo embedId="W6NZfCO5SIk" />
//         </div>
//         <div className="col-md-4">
//           <TutorialVideo embedId="ieTHC78giGQ" />
//         </div>
//         <div className="col-md-4">
//           <TutorialVideo embedId="qz0aGYrrlhU" />
//         </div>
//       </div>
//     </div>
//   );
// }

//export default App;

// import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components from react-router-dom
// import Description from '/Users/christy/Desktop/revision-app/src/components/Description/Description.jsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import About from './pages/About/About';
import HomePage from './pages/Home/Home';
import HTML from './pages/HTML-course/HTML';
import CssCourse from './pages/CssCourse/CssCourse';
import JavaScript from './pages/JavaScript/JavaScript';
// import CodeSection from './components/CodeSection/CodeSection'
import Quiz from './components/Quiz/Quiz';
import { QuizProvider } from './components/Quiz/QuizContext';
import { Toaster } from 'react-hot-toast';
import ProgressBar from './components/ProgressBar/ProgressBar'


function App() {
  return (
    <div className="App">
    <Router>
      <Navbar />
      <ProgressBar />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/html" element={<HTML />}/>
        <Route path="/css" element={<CssCourse />}/>
        <Route path="/javascript" element={<JavaScript />}/>
        <Route path="/quiz" element={<QuizProvider><Quiz /></QuizProvider>} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
      <Footer />
    </Router>
    </div>
  )
}



export default App;

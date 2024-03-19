<<<<<<< HEAD
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/Home/Home.jsx';
import Footer from './components/Footer/Footer.jsx';
//import ModulePage from './ModulePage/ModulePage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import HTML from './components/HTML-course/HTML.jsx'
import CheatSheets from './components/CheatSheets/CheatSheets.jsx';
import JavaScript from './components/JavaScript/JavaScript.jsx';
import CodeSection from './components/CodeSection/CodeSection.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CssCourse from './components/CssCourse/CssCourse.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Quiz from './components/Quiz/Quiz.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        < Navbar/>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/modules" element={<ModulePage />} /> */}
          <Route path="/html" element={<HTML />} />
          <Route path="/cssCourse" element={<CssCourse />} />
          <Route path="/javaScript" element={<JavaScript />} />
          <Route path="/cheatSheets" element={<CheatSheets />} />
          <Route path="/codeSection" element={<CodeSection />} />
          <Route path="/quiz" element={<Quiz />} />
          

          {/* Add other routes as necessary */}
        </Routes>
        </ErrorBoundary>
        <Footer />
      </Router>
    </div>
  );
=======
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import necessary components from react-router-dom
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
// import Quiz from './components/Quiz/Quiz';
// import { QuizProvider } from './components/Quiz/QuizContext';

function App() {
  return (
    <div className="App">
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/html" element={<HTML />}/>
        <Route path="/css" element={<CssCourse />}/>
        <Route path="/javascript" element={<JavaScript />}/>
      </Routes>

      <Footer />
    </Router>
    </div>  
  )
>>>>>>> cff83ad42ec239489f30e8caf43a29ab452c09ea
}

export default App;

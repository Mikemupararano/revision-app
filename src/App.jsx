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
}

export default App;

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
}

export default App;

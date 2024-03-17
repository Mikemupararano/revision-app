import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Home';
import CodeSection from './components/CodeSection/CodeSection'
import Quiz from './components/Quiz/Quiz';
import { QuizProvider } from './components/Quiz/QuizContext';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar /> {/* Navbar with logo */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} /> 
           <Route path="/code" element={<CodeSection/>} />
             <Route path="quiz" element={<QuizProvider/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
export default App;



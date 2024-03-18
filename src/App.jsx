// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import About from './components/About/About';
import ModulePage from './components/ModulePage/ModulePage';
import Quiz from './components/Quiz/Quiz'; // Import the Quiz component
import { QuizProvider } from './components/Quiz/QuizContext'; // Import the QuizProvider
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/module" element={<ModulePage />} />
          {/* Route for the Quiz component */}
          <Route path="/module/quiz" element={<QuizProvider><Quiz /></QuizProvider>} />
        </Routes>
        <Toaster position="top-left" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;

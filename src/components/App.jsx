import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar/Navbar';
import HomePage from './Home/Home';
import Footer from './Footer/Footer';
import ModulePage from './ModulePage/ModulePage';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import HTML from './HTML-course/HTML'
import CheatSheets from './CheatSheets/CheatSheets';
import JavaScript from './JavaScript/JavaScript';
import CodeSection from './CodeSection/CodeSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/modules" element={<ModulePage />} /> */}
          <Route path="/html" element={<HTML />} />
          <Route path="/css" element={<cssCourse />} />
          <Route path="/codesection" element={<codeSection />} />
           <Route path="/cheatsheets" element={<CheatSheets />} />
          {/* Add other routes as necessary */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

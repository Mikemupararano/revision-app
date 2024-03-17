import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import necessary components from react-router-dom
import Description from '/Users/christy/Desktop/revision-app/src/components/Description/Description.jsx';

function App() {
  return (
    <div>
      <h1>Hello Team!</h1>
      <Router>
        <Routes> 
          <Route path="/html" element={<Description searchTerm="HTML" />} />
          <Route path="/css" element={<Description searchTerm="CSS" />} />
          <Route path="/javascript" element={<Description searchTerm="JavaScript" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
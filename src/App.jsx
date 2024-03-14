import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Import necessary components from react-router-dom
import Description from '/Users/christy/Desktop/revision-app/src/components/Description/Description.jsx';

function App() {
  return (
    <div>
      <Router> {/* Wrap your routes with Router component */}
        <div>
          <Route path="/html" exact render={() => <Description searchTerm="HTML" />} />
          <Route path="/css" render={() => <Description searchTerm="CSS" />} />
          <Route path="/javascript" render={() => <Description searchTerm="JavaScript" />} />
          {/* Add more routes as needed */}
        </div>
      </Router> {/* Close the Router component */}
      <div>
        <h1>Hello Team!</h1>
      </div>
    </div>
  );
}

export default App;
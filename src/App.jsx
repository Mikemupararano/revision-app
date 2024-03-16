import React from 'react';
import { pdfjs } from 'react-pdf'; // Import pdfjs from react-pdf
import CheatSheets from './components/CheatSheets/CheatSheets'; // Import the CheatSheets component

// Set up PDF worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function App() {
  return (
    <div>
      <h1>Hello Team!</h1>
      <CheatSheets /> {/* Render the CheatSheets component */}
    </div>
  );
}

export default App;

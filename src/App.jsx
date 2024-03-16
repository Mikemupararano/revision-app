import React from 'react';
import { pdfjs } from 'react-pdf'; // Import pdfjs from react-pdf
import CheatSheets from './components/CheatSheets/CheatSheets'; // Import the CheatSheets component

// Set up PDF worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function App() {
const[pdffile, setPdFile] = useState(null);

  return (
    <div>
      <h1>Hello Team!</h1>
      <CheatSheets /> {/* Render the CheatSheets component */}
    </div>
  );
}

const showPDF = (pdf)=> {
  window.open('http://localhost:5174/files/${pdf}', "_blank", "noreferrer");
  setPdffile('http://localhost:5174/files/${pdf}')
};

<CheatSheets pdfFile={pdfFfile}/>
export default App;

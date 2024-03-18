import React from 'react';
// import { pdfjs } from 'react-pdf'; // Import pdfjs from react-pdf
// import CheatSheets from './components/CheatSheets/CheatSheets'; // Import the CheatSheets component

// Set up PDF worker source
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// 'pdfjs-dist/build/pdf.worker.min.js',
// import.meta.url,
// ).toString();

function App() {
  // const [pdfFile, setPdFile] = useState(null);

  return (
    <>
      <h1>Hello Team!</h1>
      <section>
        <h2>javascript</h2>
        <p>Embed here </p>
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="200" height="250"></object>
      </section >


      <section>
        <h2>CSS</h2>
        <p>Embed here </p>
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="200" height="250"></object>
      </section >

      <section>
        <h2>HTML</h2>
        <p>Embed here </p>
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="200" height="250"></object>
      </section >
    </>

  );
}

// const showPDF = (pdf) => {
// window.open('http://localhost:5174/files/${pdf}', "_blank", "noreferrer");
// setPdffile('http://localhost:5174/files/${pdf}')
// };

{/* <CheatSheets pdfFile={pdfFile} /> */ }
export default App;

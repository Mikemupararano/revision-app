import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import { pdfjs } from 'react-pdf';
import CheatSheets from "./assets/CheatSheets"; // Import the CheatSheets component

// Set up PDF worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

// Render application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <CheatSheets /> {/* Render CheatSheets component here */}
  </React.StrictMode>
);

<CheatSheets/>
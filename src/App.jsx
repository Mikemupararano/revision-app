import React from 'react';

function App() {
  // const [pdfFile, setPdFile] = useState(null);

  return (
    <>
      <h1>Hello Team!</h1>
      <section>
        <h2>Javascript</h2>
        <p> </p>
        c
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="450px" height="450px"></object>
      </section >


      <section>
        <h2>CSS</h2>
        <p></p>
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="450px" height="450px"></object>
      </section >

      <section>
        <h2>HTML</h2>
        <p></p>
        <object data="/pdfs/javascript.pdf" type="application/pdf" width="450px" height="450px"></object>
      </section >
    </>

  );
}

export default App;

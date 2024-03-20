import React from 'react';
import Description from '../../components/Description/Description';
import CodeSection from '../../components/CodeSection/CodeSection';
import '../ModulePage.css'
import Tutorial from "../../components/Tutorial/Tutorial"

const HTML = () => {
  return (
    <div className="container-module">
      <div className="row">
        <div className="col description-section">
          <Description searchTerm={"html"} />
        </div>
      </div >
      <div className="row">
        <div className="col codesnippet-section">
          <CodeSection />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="row">
            <div className="col-md tutorial-section">
              <h1>Tutorial</h1>
              <Tutorial embedId="W6NZfCO5SIk" />
            </div>
            <div className="col-md cheatsheet-section">
              <h1>Cheat Sheets</h1>
              <object data="/pdfs/html.pdf" type="application/pdf"></object>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HTML
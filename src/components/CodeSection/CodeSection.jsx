
import React from 'react'
import './CodeSection.css'
import { useState, useCallback } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function CodeSection() {
  const [value, setValue] = useState("console.log('hello world!');");
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return (
  <>
  <p>Hello!</p>
  <CodeMirror value={value} height="200px" extensions={[javascript({ jsx: true })]} onChange={onChange} />;
  </>
  )

}

 export default CodeSection


import React, { useState, useCallback, useEffect } from "react";
import './CodeSection.css'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function CodeEditor({ value, onChange }) {
  return (
    <>
      <p>Hello!</p>
      <CodeMirror value={value} height="200px" extensions={[javascript({ jsx: true })]} onChange={onChange} />
    </>
  );
}

function CodeSnippetOutput({ code }) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      setOutput(args.join(" "));
      originalLog(...args);
    };

    try {
      eval(code);
    } catch (error) {
      setOutput(error.toString());
    }

    console.log = originalLog;
  }, [code]);

  return (
    <>
      <h2>Output:</h2>
      <pre>{output}</pre>
    </>
  );
}

function CodeSection() {
  const [value, setValue] = useState("");
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  return (
    <>
      <CodeEditor value={value} onChange={onChange} />
      <CodeSnippetOutput code={value} />
    </>
  );
}

export default CodeSection;


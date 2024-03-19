import React, { useState, useEffect } from 'react';
import { CodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function Editor() {
  // Initialize the content from local storage or use a default value
  const [code, setCode] = useState(() => {
    const savedCode = localStorage.getItem('code');
    return savedCode || "// Start typing your code here";
  });

  // Update local storage whenever the code changes
  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code]);

  // Handle the change event
  const handleChange = (value, viewUpdate) => {
    setCode(value);
  };

  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[javascript()]}
      onChange={handleChange}
    />
  );
}

export default Editor;
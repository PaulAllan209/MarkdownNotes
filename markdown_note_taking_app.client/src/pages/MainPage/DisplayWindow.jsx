import React, { useState, useEffect } from 'react';
import './DisplayWindow.css'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function DisplayWindow(props) {
    const [displayContent, setDisplayContent] = useState();

    useEffect(() => {
            setDisplayContent(props.selectedFileContent)
        }
    , [props.selectedFileContent]);
  return (
      <div className="display-window">
          <Markdown remarkPlugins={[remarkGfm]}>{displayContent}</Markdown>
      </div>
  );
}

export default DisplayWindow;
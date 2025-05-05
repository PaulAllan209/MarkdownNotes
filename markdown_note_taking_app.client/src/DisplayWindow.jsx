import React, { useState, useEffect } from 'react';
import './DisplayWindow.css'
import Markdown from 'react-markdown';

function DisplayWindow(props) {
    const [displayContent, setDisplayContent] = useState();

    useEffect(() => {
            setDisplayContent(props.selectedFileContent)
        }
    , [props.selectedFileContent]);
  return (
      <div className="display-window">
          <Markdown>{displayContent}</Markdown>
      </div>
  );
}

export default DisplayWindow;
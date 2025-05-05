import React, { useState, useEffect } from 'react';
import './DisplayWindow.css'
import Markdown from 'react-markdown';

function DisplayWindow(props) {
    const [displayContent, setDisplayContent] = useState();

    useEffect(() => {
        if (props.selectedFileGuid != null) {
            fetch(`https://localhost:7271/api/markdown/${props.selectedFileGuid}`)
                .then(response => {
                    if (response.ok) {
                        console.log("Successfully got the file content.")
                        return response.json();
                    }
                    else {
                        console.error("Error getting file content");
                    }
                })
                .then(data => {
                    setDisplayContent(data.fileContent || '');
                })
        }
        

    }, [props.selectedFileGuid]);
  return (
      <div className="display-window">
          <Markdown>{displayContent}</Markdown>
      </div>
  );
}

export default DisplayWindow;
import './AcceptChangesWindow.css';
import React, { useContext } from 'react';
import { AcceptChangesWindowContext } from './contexts/AcceptChangesWindowContext.jsx';


function AcceptChangesWindow() {
    const
        {
            grammarCheckedFileContent,
            setGrammarCheckedFileContent,
            setFileContent,
            setFileContentInDb,
            setShowGrammarView,
            selectedFileGuid,
            setIsSaved
        } = useContext(AcceptChangesWindowContext);

    const handleAcceptChanges = (fileId, grammarCheckedFileContent) => {
        const patchDocument = [
            {
                "op": "replace",
                "path": "/fileContent",
                "value": grammarCheckedFileContent
            }
        ];

        fetch(`https://localhost:7271/api/markdown/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(patchDocument)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Successfully saved the file to the database.");
                    setIsSaved(true);
                    setShowGrammarView(false);
                    setFileContent(grammarCheckedFileContent);
                    setFileContentInDb(grammarCheckedFileContent);
                    setGrammarCheckedFileContent('');
                }
                else {
                    console.error("Failed to save the file");
                    alert("Failed to save the file");
                }
            });
    };

    const handleRejectChanges = () => {
        setShowGrammarView(false);
    }
    return (
       <div className="accept-changes-window">
            <div className="accept-changes-text">
                Accept Changes?
            </div>
            <button className="accept-button" onClick={() => handleAcceptChanges(selectedFileGuid, grammarCheckedFileContent) }>&#10003;</button>
            <button className="reject-button" onClick={handleRejectChanges}>&#10007;</button>
      </div>
  );
}

export default AcceptChangesWindow;
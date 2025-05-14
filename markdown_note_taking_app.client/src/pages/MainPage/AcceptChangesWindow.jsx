import './AcceptChangesWindow.css';
import React, { useContext } from 'react';
import { AcceptChangesWindowContext } from '../../contexts/AcceptChangesWindowContext.jsx';
import { handleFileContentSave } from '../../utils/apiUtils.js';


function AcceptChangesWindow() {
    const
        {
            grammarCheckedFileContent,
            setGrammarCheckedFileContent,
            setFileContent,
            setFileContentInDb,
            setShowGrammarView,
            selectedFile,
            setIsSaved
        } = useContext(AcceptChangesWindowContext);

    const handleAcceptChanges = (fileId, grammarCheckedFileContent) => {

        handleFileContentSave(
            fileId,
            grammarCheckedFileContent,
            //onSuccess callback
            () => {
                setIsSaved(true);
                setShowGrammarView(false);
                setFileContent(grammarCheckedFileContent);
                setFileContentInDb(grammarCheckedFileContent);
                setGrammarCheckedFileContent('');
            })
    };

    const handleRejectChanges = () => {
        setShowGrammarView(false);
    }
    return (
       <div className="accept-changes-window">
            <div className="accept-changes-text">
                Accept Changes?
            </div>
            <button className="accept-button" onClick={() => handleAcceptChanges(selectedFile.guid, grammarCheckedFileContent) }>&#10003;</button>
            <button className="reject-button" onClick={handleRejectChanges}>&#10007;</button>
      </div>
  );
}

export default AcceptChangesWindow;
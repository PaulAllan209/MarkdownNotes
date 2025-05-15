import './AcceptChangesWindow.css';
import React, { useContext } from 'react';
import { AcceptChangesWindowContext } from '../../contexts/AcceptChangesWindowContext.jsx';
import { handleFileContentSave } from '../../utils/apiUtils.js';
import { useNavigate } from 'react-router-dom';


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

    const navigate = useNavigate();


    const handleAcceptChanges = (fileId, grammarCheckedFileContent) => {
        try {
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
        } catch (error) {
            if (error.message === 'TokenExpired') {
                // Go back to login page
                navigate('/login');
            }
        }
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
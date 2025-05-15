import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import GrammarSuggestionWindow from './GrammarSuggestionWindow';
import { handleFileGet } from '../../utils/apiUtils.js';
import { AcceptChangesWindowContext } from '../../contexts/AcceptChangesWindowContext.jsx';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { getAccessToken, getRefreshToken } from '../../utils/authenticationUtils';

function MainPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContentInDb, setFileContentInDb] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [showGrammarView, setShowGrammarView] = useState(false);
    const [grammarCheckedFileContent, setGrammarCheckedFileContent] = useState('');

    // For checking if there are still access tokens
    // If the token strings are empty the user will be redirected to the login page
    const navigate = useNavigate();

    const debouncedSaveCheck = useCallback(
        debounce((content, dbContent) => {
            setIsSaved(content === dbContent);
        }, 500),
        []
    );

    // Getting the file content if selected file and file content chnanges
    useEffect(() => {
        if (selectedFile != null) {
            try {
                handleFileGet(
                    {
                        fileId: selectedFile.guid,
                        onSuccess: (fileTitle, fileContent) => {
                            setFileContent(fileContent || '');
                            setFileContentInDb(fileContent || '');
                        }
                    });
            } catch (error) {
                if (error.message === 'TokenExpired') {
                    // Go back to login page
                    navigate('/login');
                }
            }
            
        }
    }, [selectedFile]);

    // Saving functionality
    // PATCH Request api for saving is in UserWindowBar.jsx
    useEffect(() => {
        if (fileContent !== null && fileContentInDb !== null) {
            // debouncedSaveCheck meaning that it will wait 500ms before running the comparison
            debouncedSaveCheck(fileContent, fileContentInDb); 
        }
    }, [fileContent, fileContentInDb, debouncedSaveCheck]);

    //Grammar checking
    useEffect(() => {
        if (showGrammarView) {
            try {
                handleFileGet({
                    fileId: selectedFile.guid,
                    grammarCheck: true,
                    onSuccess: (fileTitle, fileContent) => {
                        setGrammarCheckedFileContent(fileContent || '')
                    }
                })
            } catch (error) {
                if (error.message === 'TokenExpired') {
                    // Go back to login page
                    navigate('/login');
                }
            }
        }
        else {
            setGrammarCheckedFileContent('');
        }
    }, [showGrammarView]);

    return (
        <div className="app-container">
            <SideBar onFileSelect={setSelectedFile} />
            <div className="user-window">
                <AcceptChangesWindowContext.Provider value={
                    {
                        grammarCheckedFileContent,
                        setGrammarCheckedFileContent,
                        setFileContent,
                        setFileContentInDb,
                        setShowGrammarView,
                        selectedFile: selectedFile,
                        setIsSaved
                    }
                }>
                    <UserWindowBar
                        saveState={isSaved}
                        setSaveState={setIsSaved}
                        fileGuid={selectedFile?.guid}
                        fileTitle={selectedFile?.title}
                        fileCurrentContent={fileContent}
                        showGrammarView={showGrammarView}
                        setShowGrammarView={setShowGrammarView}
                        setGrammarCheckedFileContent={setGrammarCheckedFileContent} />
                </AcceptChangesWindowContext.Provider>

                <div className="window-content-container">
                    {!showGrammarView ? <EditingWindow selectedFileContent={fileContent} setContent={setFileContent} /> :
                        <GrammarSuggestionWindow grammarCheckedFileContent={grammarCheckedFileContent} setGrammarCheckedFileContent={setGrammarCheckedFileContent} />}

                    <DisplayWindow selectedFileContent={fileContent} />
                </div>
            </div>

        </div>
    );
}

export default MainPage
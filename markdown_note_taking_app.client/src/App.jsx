import './App.css';
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import GrammarSuggestionWindow from './GrammarSuggestionWindow';
import { handleFileGet } from './utils/apiUtils.js';
import { AcceptChangesWindowContext } from './contexts/AcceptChangesWindowContext.jsx';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContentInDb, setFileContentInDb] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [showGrammarView, setShowGrammarView] = useState(false);
    const [grammarCheckedFileContent, setGrammarCheckedFileContent] = useState('');

    const debouncedSaveCheck = useCallback(
        debounce((content, dbContent) => {
            setIsSaved(content === dbContent);
        }, 500),
        []
    );

    // Getting the file content if selected file and file content chnanges
    useEffect(() => {
        if (selectedFile != null) {

            handleFileGet(
                {
                    fileId: selectedFile.guid,
                    onSuccess: (fileTitle, fileContent) => {
                        setFileContent(fileContent || '');
                        setFileContentInDb(fileContent || '');
                    }
                });
        }
    }, [selectedFile]);

    // Saving functionality
    // PATCH Request api for saving is in UserWindowBar.jsx
    useEffect(() => {
        if (fileContent !== null && fileContentInDb !== null) {
            debouncedSaveCheck(fileContent, fileContentInDb);
        }
    }, [fileContent, fileContentInDb, debouncedSaveCheck]);

    //Grammar checking
    useEffect(() => {
        if (showGrammarView) {
            handleFileGet({
                fileId: selectedFile.guid,
                grammarCheck: true,
                onSuccess: (fileTitle, fileContent) => {
                    setGrammarCheckedFileContent(fileContent || '')
                }
            })
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

export default App;
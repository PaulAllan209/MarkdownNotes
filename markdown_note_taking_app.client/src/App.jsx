import './App.css';
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import GrammarSuggestionWindow from './GrammarSuggestionWindow';
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { debounce } from 'lodash';

export const AcceptChangesWindowContext = createContext();

function App() {
    const [selectedFileGuid, setSelectedFileGuid] = useState(null);
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
        if (selectedFileGuid != null) {
            fetch(`https://localhost:7271/api/markdown/${selectedFileGuid}`)
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
                    setFileContent(data.fileContent || '');
                    setFileContentInDb(data.fileContent || '');
                })
        }
    }, [selectedFileGuid]);

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
            fetch(`https://localhost:7271/api/markdown/${selectedFileGuid}/?checkGrammar=true`)
                .then(response => {
                    if (response.ok) {
                        console.log("Successfully got the file content with grammar checked.")
                        return response.json();
                    }
                    else {
                        console.error("Error getting file content with grammar checked.");
                    }
                })
                .then(data => {
                    setGrammarCheckedFileContent(data.fileContent || '');
                })
        }
        else {
            setGrammarCheckedFileContent('');
        }
    }, [showGrammarView]);

    return (
        <div className="app-container">
            <SideBar onFileSelect={setSelectedFileGuid} />
            <div className="user-window">
                <AcceptChangesWindowContext.Provider value={
                    {
                        grammarCheckedFileContent,
                        setGrammarCheckedFileContent,
                        setFileContent,
                        setFileContentInDb,
                        setShowGrammarView,
                        selectedFileGuid,
                        setIsSaved
                    }
                }>
                    <UserWindowBar
                        saveState={isSaved}
                        setSaveState={setIsSaved}
                        fileGuid={selectedFileGuid}
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
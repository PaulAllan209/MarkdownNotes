import './App.css';
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

function App() {
    const [selectedFileGuid, setSelectedFileGuid] = useState(null);
    const [fileContentInDb, setFileContentInDb] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [isSaved, setIsSaved] = useState(true);

    const debouncedSaveCheck = useCallback(
        debounce((content, dbContent) => {
            setIsSaved(content === dbContent);
        }, 500),
        []
    );

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

    useEffect(() => {
        if (fileContent !== null && fileContentInDb !== null) {
            debouncedSaveCheck(fileContent, fileContentInDb);
        }
    }, [fileContent, fileContentInDb, debouncedSaveCheck]);

    return (
        <div className="app-container">
            <SideBar onFileSelect={setSelectedFileGuid} />
            <div className="user-window">
                <UserWindowBar saveState={isSaved} setSaveState={setIsSaved} />
                <div className="window-content-container">
                    <EditingWindow selectedFileContent={fileContent} setContent={setFileContent} />
                    <DisplayWindow selectedFileContent={fileContent} />
                </div>
            </div>
            
        </div>
    );
}

export default App;
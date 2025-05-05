import './App.css';
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow'
import React, { useState, useEffect } from 'react';

function App() {
    const [selectedFileGuid, setSelectedFileGuid] = useState(null);
    const [fileContent, setFileContent] = useState(null);

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
                })
        }
    }, [selectedFileGuid]);

    return (
        <>
            <SideBar onFileSelect={setSelectedFileGuid} />
            <DisplayWindow selectedFileContent={fileContent} />
            <EditingWindow selectedFileContent={fileContent} setContent={setFileContent} />
        </>
    );
    
    
}

export default App;
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import GrammarSuggestionWindow from './GrammarSuggestionWindow';
import { handleFileGet } from '../../utils/apiUtils.js';
import { AcceptChangesWindowContext } from '../../contexts/AcceptChangesWindowContext.jsx';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

function MainPage() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContentInDb, setFileContentInDb] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [showGrammarView, setShowGrammarView] = useState(false);
    const [grammarCheckedFileContent, setGrammarCheckedFileContent] = useState('');
    const [isCheckingGrammar, setIsCheckingGrammar] = useState(false); // for the spinner loading icon
    const editorRef = useRef(null); // For the toolbar in the userbar

    // For checking if there are still access tokens
    // If the token strings are empty the user will be redirected to the login page
    const navigate = useNavigate();

    const debouncedSaveCheck = useCallback(
        debounce((content, dbContent) => {
            setIsSaved(content === dbContent);
        }, 500),
        []
    );

    // Getting the list of files and setting the default file
    useEffect(() => {
        try {

            handleFileGet({
                onSuccess: (localFiles) => {
                    // Map the files
                    const mappedFiles = localFiles.map(file => ({
                        guid: file.id,
                        title: file.title,
                        fileContent: file.fileContent
                    }));

                    // Update files state
                    setFiles(mappedFiles);

                    // If files exist, set the first one as selected and update content
                    if (mappedFiles.length > 0) {
                        setSelectedFile(mappedFiles[0]);
                        setFileContent(mappedFiles[0].fileContent || '');
                        setFileContentInDb(mappedFiles[0].fileContent || '');

                    }
                }
            });
        } catch (error) {
            if (error.message === 'TokenExpired') {
                // Go back to login page
                navigate('/login');
            }
        }
    }, []);

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
            const checkGrammar = async () => {
                try {
                    setIsCheckingGrammar(true);
                    await handleFileGet({
                        fileId: selectedFile.guid,
                        grammarCheck: true,
                        onSuccess: (fileTitle, fileContent) => {
                            setGrammarCheckedFileContent(fileContent || '')
                        }
                    });
                    setIsCheckingGrammar(false);
                } catch (error) {
                    if (error.message === 'TokenExpired') {
                        // Go back to login page
                        navigate('/login');
                    }
                }
            }
            checkGrammar();
        }
        else {
            setGrammarCheckedFileContent('');
        }
    }, [showGrammarView]);

    return (
        <div className="app-container">
            <SideBar
                onFileSelect={setSelectedFile}
                files={files}
                setFiles={ setFiles }
            />
            <div className="user-window">
                <AcceptChangesWindowContext.Provider value={
                    {
                        grammarCheckedFileContent,
                        setGrammarCheckedFileContent,
                        setFileContent,
                        setFileContentInDb,
                        setShowGrammarView,
                        selectedFile: selectedFile,
                        setIsSaved,
                    }
                }>
                    <UserWindowBar
                        saveState={isSaved}
                        setSaveState={setIsSaved}
                        fileGuid={selectedFile?.guid}
                        fileTitle={selectedFile?.title}
                        setFileCurrentContent={setFileContent}
                        fileCurrentContent={fileContent}
                        showGrammarView={showGrammarView}
                        setShowGrammarView={setShowGrammarView}
                        setGrammarCheckedFileContent={setGrammarCheckedFileContent}
                        isCheckingGrammar={isCheckingGrammar}
                        setIsCheckingGrammar={setIsCheckingGrammar}
                        editorRef={editorRef}
                    />
                </AcceptChangesWindowContext.Provider>

                <div className="window-content-container">
                    {!showGrammarView ? <EditingWindow
                        selectedFileContent={fileContent}
                        setContent={setFileContent}
                        editorRef={editorRef}
                    /> :
                        <GrammarSuggestionWindow
                            grammarCheckedFileContent={grammarCheckedFileContent}
                            setGrammarCheckedFileContent={setGrammarCheckedFileContent}
                            isCheckingGrammar={isCheckingGrammar}
                        />}

                    <DisplayWindow selectedFileContent={fileContent} />
                </div>
            </div>

        </div>
    );
}

export default MainPage
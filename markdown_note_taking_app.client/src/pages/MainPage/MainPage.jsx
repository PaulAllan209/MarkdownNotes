import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import EditingWindow from './EditingWindow';
import UserWindowBar from './UserWindowBar';
import GrammarSuggestionWindow from './GrammarSuggestionWindow';
import { handleFileGet } from '../../utils/apiUtils.js';
import { getLocalFiles, getLocalFile } from '../../utils/localStorageMarkdownFilesUtils.js';
import { AcceptChangesWindowContext } from '../../contexts/AcceptChangesWindowContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { createLogger } from '../../logger/logger.js'
import { isTokenExpired, refreshToken } from '../../utils/authenticationUtils';

function MainPage() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContentInDb, setFileContentInDb] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [showGrammarView, setShowGrammarView] = useState(false);
    const [grammarCheckedFileContent, setGrammarCheckedFileContent] = useState('');
    const [isCheckingGrammar, setIsCheckingGrammar] = useState(false); // for the spinner loading icon

    
    const { isAuthenticated, setIsAuthenticated } = useAuth();

    const editorRef = useRef(null); // For the toolbar in the userbar

    const logger = createLogger('MainPage');

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
        const fetchFiles = async () => {
            let authState = false;
            if (!isTokenExpired()) {
                authState = true;
                setIsAuthenticated(authState);
            } else {
                authState = await refreshToken();
            }
            setIsAuthenticated(authState);
            logger.info(`Authentication state is ${isAuthenticated}`);

            if (authState) {
                try {
                    await handleFileGet({
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
                        setIsAuthenticated(false);
                        navigate('/login');
                    }
                }
            } else {
                logger.info("files are now being made to local files");
                const localFiles = getLocalFiles().map(file => ({
                    guid: file.guid,
                    title: file.title,
                    fileContent: file.fileContent
                }));

                setFiles(localFiles);

                // If files exist, set the first one as selected and update content
                if (localFiles.length > 0) {
                    setSelectedFile(localFiles[0]);
                    setFileContent(localFiles[0].fileContent || '');
                    setFileContentInDb(localFiles[0].fileContent || '');
                }
                logger.info('The list of files currently', localFiles);
            }
        };

        fetchFiles();
        
    }, []);

    // Getting the file content if selected file and file content chnanges
    useEffect(() => {
        if (isAuthenticated) {
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
                        setIsAuthenticated(false);
                        navigate('/login');
                    }
                }

            }
        } else {
            try {
                if (selectedFile != null) {
                    const currFile = getLocalFile(selectedFile.guid);
                    setFileContent(currFile.fileContent || '');
                    setFileContentInDb(currFile.fileContent || '');
                }
            } catch (error) {
                logger.error("Error in getting file content", error);
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
        if (isAuthenticated) {
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
                            setIsAuthenticated(false);
                            navigate('/login');
                        }
                    }
                }
                checkGrammar();
            }
            else {
                setGrammarCheckedFileContent('');
            }
        } else {
            // TODO: No grammar checking for non account users add locked symbol for grammar checking and blurred button
        }
        
    }, [showGrammarView]);

    return (
        <div className="app-container">
            <SideBar
                onFileSelect={setSelectedFile}
                files={files}
                setFiles={setFiles}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
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
                        isAuthenticated={isAuthenticated}
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
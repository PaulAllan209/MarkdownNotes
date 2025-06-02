import React, { useState, useEffect, useRef, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFileCreate, handleFileGet, handleFileNameSave, handleFileDelete } from '../../utils/apiUtils.js';
import { uploadLocalFile, updateLocalFileName, saveLocalFile, deleteLocalFile } from '../../utils/localStorageMarkdownFilesUtils.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './SideBar.css'

// Note that if you dont do this the images wont show when running the web app on docker
// Importing the files on a dedicated variable is recommended
import addFileIcon from '/assets/button_icons/add_file.png';
import uploadFileIcon from '/assets/button_icons/upload_file.png';
import deleteFileIcon from '/assets/button_icons/delete_file.png';

function SideBar(props) {
    //const [files, setFiles] = useState([]);
    const { files, setFiles } = props;
    const [fileName, setFileName] = useState();
    const [selectedFileIndex, setSelectedFileIndex] = useState(0);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [isRenamingFile, setIsRenamingFile] = useState(false);
    const fileInputRef = useRef(null);
    const newFileInputRef = useRef(null);

    const { setIsAuthenticated, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (isCreatingFile && newFileInputRef.current) {
            newFileInputRef.current.focus();
        }
    }, [isCreatingFile]);

    const handleCreateFileBtn = () => {
        setIsCreatingFile(true);
        setFileName('');
    }

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    }

    const handleFileRename = (index) => {
        setSelectedFileIndex(index)
        setIsRenamingFile(true);
        setFileName(files[index].title);
    }

    const submitNewFile = async () => {
        if (props.isAuthenticated) {
            await handleFileCreate(
                {
                    fileName: fileName,
                    onSuccess: (fileId, fileName) => {
                        const newFile = { guid: fileId, title: fileName };

                        setFiles(prevFiles => [...prevFiles, newFile]);
                        setSelectedFileIndex(files.length);
                        props.onFileSelect(newFile);

                        setIsCreatingFile(false);
                        setFileName('');
                    }
                }
            );
        } else {
            const fileToSaveLocal = {
                title: fileName
            }
            const fileSaved = saveLocalFile(fileToSaveLocal);
            setFiles(prevFiles => [...prevFiles, fileSaved]);
            setSelectedFileIndex(files.length);
            props.onFileSelect(fileSaved);

            setIsCreatingFile(false);
            setFileName('');
        }
    }

    const submitNewFileName = async (fileName, fileId) => {
        if (props.isAuthenticated) {
            try {
                await handleFileNameSave(fileId, fileName,
                    // onSuccess callback
                    () => {
                        setFiles(prevFiles => prevFiles.map(file =>
                            file.guid == fileId ? { ...file, title: fileName } : file
                        ));
                    });
            } catch (error) {
                if (error.message === 'TokenExpired') {
                    // Go back to login page
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            }
        } else {
            updateLocalFileName(fileId, fileName);
            setFiles(prevFiles => prevFiles.map(file =>
                file.guid == fileId ? { ...file, title: fileName } : file
            ));
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            if (isCreatingFile) {
                e.preventDefault();
                await submitNewFile();
            }
            else if (isRenamingFile) {
                e.preventDefault();
                const fileId = files[selectedFileIndex].guid;
                submitNewFileName(fileName, fileId);
                setFileName('');
                setIsRenamingFile(false);
            }
        }
        else if (e.key === 'Escape') {
            setIsCreatingFile(false);
            setIsRenamingFile(false);
        }
    }

    const handleFileUploadBtn = async (event) => {
        const file = event.target.files[0];

        if (props.isAuthenticated) {
            try {
                await handleFileCreate(
                    {
                        file: file,
                        onSuccess: (fileId, fileName) => {
                            setFiles(prevFiles => [...prevFiles, { guid: fileId, title: fileName }]);
                        }
                    }
                );
            } catch (error) {
                if (error.message === 'TokenExpired') {
                    // Go back to login page
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            }
        } else {
            const fileSaved = await uploadLocalFile(file);
            setFiles(prevFiles => [...prevFiles, { guid: fileSaved.guid, title: fileSaved.title }]);
        }
    }

    const triggerFileInputBtn = () => {
        fileInputRef.current.click();
    };

    const handleFileDeleteBtn = async () => {
        const selectedFileGuid = files[selectedFileIndex].guid;
        if (props.isAuthenticated) {
            try {
                await handleFileDelete(selectedFileGuid, () => {
                    //on success callback
                    setFiles(prevFiles => prevFiles.filter(file => file.guid != selectedFileGuid));

                });
            } catch (error) {
                if (error.message === 'TokenExpired') {
                    // Go back to login page
                    setIsAuthenticated(false);
                    navigate('/login');
                }
            }
        } else {
            deleteLocalFile(selectedFileGuid);
            setFiles(prevFiles => prevFiles.filter(file => file.guid != selectedFileGuid));
        }
        
        setSelectedFileIndex(null);
    };

    const handleFileSelected = (index) => {
        setSelectedFileIndex(index);
        props.onFileSelect(files[index] || null);
    }

    return (
        <div className="side-bar">
            <div className="side-bar-buttons-container">
                <button className="side-bar-buttons" onClick={handleCreateFileBtn}><img src={addFileIcon} className="side-bar-icons"></img></button>
                <button className="side-bar-buttons" onClick={triggerFileInputBtn}><img src={uploadFileIcon} className="side-bar-icons"></img></button>
                <input
                    type="file"
                    accept=".md"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUploadBtn}
                />
                <button className="side-bar-buttons" onClick={handleFileDeleteBtn}><img src={deleteFileIcon} className="side-bar-icons"></img></button>
            </div>
            

            <div id="file-list">
                <ul>
                    {files.map((file, index) =>
                        <li key={index}
                            className={index == selectedFileIndex ? 'selected-file' : ''}
                            onClick={() => handleFileSelected(index)}
                            onDoubleClick={() => handleFileRename(index)}>
                            {(isRenamingFile && (index == selectedFileIndex)) ? (
                                <input
                                    type="text"
                                    className="rename-file-input"
                                    value={fileName}
                                    onChange={handleFileNameChange}
                                    onKeyDown={handleKeyDown}
                                />
                            ) :
                                file.title
                            }
                        </li>)
                    }
                    {
                        isCreatingFile && (
                            <li className="new-file-item">
                                <input
                                    ref={newFileInputRef}
                                    type="text"
                                    value={fileName}
                                    onChange={handleFileNameChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => setIsCreatingFile(false)}
                                    placeholder="Enter file name."
                                    className="new-file-input"
                                    />
                            </li>
                        )
                    }
                </ul>
            </div>


      </div>
  );
}

export default SideBar;
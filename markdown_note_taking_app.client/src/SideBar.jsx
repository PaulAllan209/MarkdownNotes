import React, { useState, useEffect, useRef, createContext } from 'react';
import { handleFileCreate, handleFileUpload, handleFileNameSave, handleFileDelete  } from './utils/apiUtils';
import './SideBar.css'

export const SelectedFileContext = createContext();
function SideBar(props) {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState();
    const [selectedFileIndex, setSelectedFileIndex] = useState(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [isRenamingFile, setIsRenamingFile] = useState(false);
    const fileInputRef = useRef(null);
    const newFileInputRef = useRef(null);

    // Getting the list of files
    useEffect(() => {
        fetch('https://localhost:7271/api/markdown')
            .then(response => response.json())
            .then(data => {
                const files = data.map(file => ({
                    guid: file.id,
                    title: file.title
                }));
                setFiles(files);
            })
            .catch(error => {
                console.error('Error fetching filename data:', error);
            })
    }, []);

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

    const submitNewFileName = (fileName, fileId) => {
        handleFileNameSave(fileId, fileName,
            // onSuccess callback
            () => {
                setFiles(prevFiles => prevFiles.map(file =>
                    file.guid == fileId ? { ...file, title: fileName } : file
                ));
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isCreatingFile) {
                e.preventDefault();
                handleFileCreate(fileName, (fileId, fileName) => {
                    setFiles(prevFiles => [...prevFiles, { guid: fileId, title: fileName }]);
                    setIsCreatingFile(false);
                    setFileName('');
                });
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

    const handleFileUploadBtn = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file, (fileId, fileName) => {
            setFiles(prevFiles => [...prevFiles, { guid: fileId, title: fileName }]);
        });
    }

    const triggerFileInputBtn = () => {
        fileInputRef.current.click();
    };

    const handleFileDeleteBtn = () => {
        const selectedFileGuid = files[selectedFileIndex].guid;
        handleFileDelete(selectedFileGuid, () => {
            //on success callback
            setFiles(prevFiles => prevFiles.filter(file => file.guid != selectedFileGuid));

        });
        setSelectedFileIndex(null);
    };

    const handleFileSelected = (index) => {
        setSelectedFileIndex(index);
        props.onFileSelect(files[index]?.guid || null);
    }

    return (
        <div className="side-bar">
            <div className="side-bar-buttons-container">
                <button className="side-bar-buttons" onClick={handleCreateFileBtn}><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>

                <button className="side-bar-buttons" onClick={triggerFileInputBtn}><img src="/assets/button_icons/upload_file.png" className="side-bar-icons"></img></button>
                <input
                    type="file"
                    accept=".md"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUploadBtn}
                />
                <button className="side-bar-buttons" onClick={handleFileDeleteBtn}><img src="/assets/button_icons/delete_file.png" className="side-bar-icons"></img></button>
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
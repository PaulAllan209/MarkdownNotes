import React, { useState, useEffect, useRef, createContext } from 'react';
import { handleFileNameSave } from './utils/apiUtils';
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

    const handleCreateFile = () => {
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
                submitNewFile();
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

    const submitNewFile = () => {
        if (fileName.trim()) {
            // Create form-data for api request
            const formData = new FormData();
            const emptyFile = new Blob([], { type: 'text/markdown' });
            formData.append("markDownFile", emptyFile, `${fileName}.md`);

            //Upload the new file to api
            fileUpload(formData);
            setIsCreatingFile(false);
            setFileName('');
        }
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file.name.toLowerCase().endsWith(".md")) {
            //Prepare the file for upload
            const formData = new FormData();
            formData.append("markDownFile", file)

            // Send via POST request
            fileUpload(formData);
        }
    
        else {
            alert("Please select a valid .md file.");
        }
    }

    const handleFileSelected = (index) => {
        setSelectedFileIndex(index);
        props.onFileSelect(files[index]?.guid || null);
    }

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileDelete = () => {
        const selectedFileGuid = files[selectedFileIndex].guid;

        fetch(`https://localhost:7271/api/markdown/${selectedFileGuid}`, {
            method: 'DELETE'
        })
            .then(async response => {
                if (response.ok) {
                    console.log("File deleted successfully")

                    //Update list of files without an api call
                    setFiles(prevFiles => prevFiles.filter(file => file.guid != selectedFileGuid));
                }
                else {
                    console.error("Failed to delete file:");
                }
            })
            .catch(error => {
                console.error("Error deleting file:", error);
            });

        setSelectedFileIndex(null);
    };
    function fileUpload(body) {
        fetch('https://localhost:7271/api/markdown', {
            method: 'POST',
            body: body,
        })
            .then(response => {
                if (response.ok) {
                    console.log("File uploaded successfully");
                    return (response.json());
                }
                else {
                    console.error("Failed to upload file");
                    alert("Failed to upload file");
                }
            })
            .then(data => {
                setFiles(prevFileNames => [...prevFileNames, {guid: data.id, title:data.title}]);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                alert("Error uploading file. Please try again.");
            });
    };



    return (
        <div className="side-bar">
            <div className="side-bar-buttons-container">
                <button className="side-bar-buttons" onClick={handleCreateFile}><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>

                <button className="side-bar-buttons" onClick={triggerFileInput}><img src="/assets/button_icons/upload_file.png" className="side-bar-icons"></img></button>
                <input
                    type="file"
                    accept=".md"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button className="side-bar-buttons" onClick={handleFileDelete}><img src="/assets/button_icons/delete_file.png" className="side-bar-icons"></img></button>
                <button className="side-bar-buttons"><img src="/assets/button_icons/edit_file.png" className="side-bar-icons"></img></button>
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
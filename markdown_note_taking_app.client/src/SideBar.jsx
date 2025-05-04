import React, { useState, useEffect, useRef } from 'react';
import './SideBar.css'
function SideBar() {
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const fileInputRef = useRef(null);
    const newFileInputRef = useRef(null);

    // Getting the list of files
    useEffect(() => {
        fetch('https://localhost:7271/api/markdown')
            .then(response => response.json())
            .then(data => {
                const fileNames = data.map(file => file.title);
                setFiles(fileNames);
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


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitNewFile();
        }
        else if (e.key === 'Escape') {
            setIsCreatingFile(false);
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

    const handleFileSelected = (fileName) => {
        setSelectedFile(fileName);
    }

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                setFiles(prevFileNames => [...prevFileNames, data.title]);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                alert("Error uploading file. Please try again.");
            });
    };



    return (
      <div className="side-bar">
            <button className="side-bar-buttons" onClick={handleCreateFile}><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>
            
            <button className="side-bar-buttons" onClick={triggerFileInput}><img src="/assets/button_icons/upload_file.png" className="side-bar-icons"></img></button>
            <input
                type="file"
                accept=".md"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            <button className="side-bar-buttons"><img src="/assets/button_icons/delete_file.png" className="side-bar-icons"></img></button>
            <button className="side-bar-buttons"><img src="/assets/button_icons/edit_file.png" className="side-bar-icons"></img></button>

            <div id="file-list">
                <ul>
                    {files.map((fileName, index) =>
                        <li key={index}
                            className={index == selectedFile ? 'selected-file' : ''}
                            onClick={() => handleFileSelected(index)}>{fileName}</li>)
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
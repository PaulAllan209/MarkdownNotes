import React, { useState, useEffect, useRef } from 'react';
import './SideBar.css'
function SideBar() {
    const [fileNames, setFileNames] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch('https://localhost:7271/api/markdown')
            .then(response => response.json())
            .then(data => {
                const fileNames = data.map(file => file.title);
                setFileNames(fileNames);
            })
            .catch(error => {
                console.error('Error fetching filename data:', error);
            })
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/markdown") {
            setSelectedFile(file);
        }
        else {
            alert("Please select a valid .md file.");
        }
    }


    const triggerFileInput = () => {
        fileInputRef.current.click();
    };



    return (
      <div className="side-bar">
            <button className="side-bar-buttons"><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>
            
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
                    {fileNames.map((fileName, index) => <li key={index}>{fileName}</li>)}
                </ul>
            </div>


      </div>
  );
}

export default SideBar;
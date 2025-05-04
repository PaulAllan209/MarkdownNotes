import React, { useState, useEffect, useRef } from 'react';
import './SideBar.css'
function SideBar() {
    const [fileNames, setFileNames] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Getting the list of files
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
        if (file.name.toLowerCase().endsWith(".md")) {
            //Prepare the file for upload
            const formData = new FormData();
            formData.append("markDownFile", file)

            // Send via POST request
            fetch('https://localhost:7271/api/markdown', {
                method: 'POST',
                body: formData,
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
                    setFileNames(prevFileNames => [...prevFileNames, data.title]);
                })
                .catch(error => {
                    console.error("Error uploading file:", error);
                    alert("Error uploading file. Please try again.");
                })
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
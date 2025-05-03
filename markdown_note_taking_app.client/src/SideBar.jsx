import React, { useState, useEffect } from 'react';
import './SideBar.css'
function SideBar() {
    const [fileNames, setFileNames] = useState([]);

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



    return (
      <div className="side-bar">
            <button className="side-bar-buttons"><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>
            <button className="side-bar-buttons"><img src="/assets/button_icons/upload_file.png" className="side-bar-icons"></img></button>
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
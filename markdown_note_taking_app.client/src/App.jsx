import './App.css';
import SideBar from './SideBar';
import DisplayWindow from './DisplayWindow';
import React, { useState } from 'React';

function App() {
    const [selectedFileGuid, setSelectedFileGuid] = useState(null);
    return (
        <>

            <SideBar onFileSelect={setSelectedFileGuid} />
            <DisplayWindow selectedFileGuid={ selectedFileGuid } />
        </>
    );
    
    
}

export default App;
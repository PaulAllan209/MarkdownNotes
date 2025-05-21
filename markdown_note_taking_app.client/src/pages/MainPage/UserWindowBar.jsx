import './UserWindowBar.css';
import AcceptChangesWindow from './AcceptChangesWindow';
import { handleFileContentSave, handleFileGet } from '../../utils/apiUtils.js';
import { logout } from '../../utils/authenticationUtils.js';
import { useNavigate } from 'react-router-dom';


function UserWindowBar(props) {

    const navigate = useNavigate();

    const handleSaveSuccess = () => {
        props.setSaveState(true);
    }

    const handleGrammarCheck = async () => {
        try {
            await handleFileContentSave(props.fileGuid, props.fileCurrentContent, handleSaveSuccess); //Saves the file to the database first before checking for grammar.
        } catch (error) {
            if (error.message === 'TokenExpired') {
                // Go back to login page
                navigate('/login');
            }
        }
        props.setShowGrammarView(true);
        props.setIsCheckingGrammar(true);
    }

    const handleExportAsMarkdown = () => {
        downloadFile(props.fileCurrentContent, props.fileTitle, 'text/markdown');
    }

    const handleExportAsHtml = async () => {
        try {
            const data = await handleFileGet(
                {
                    fileId: props.fileGuid,
                    asHtml: true
                }
            );

            if (data && data.fileContentAsHtml) {
                downloadFile(props.fileContentAsHtml, props.fileTitle, 'text/html');
            } else {
                console.error("HTML content is undefined or not returned properly.");
                alert("Failed to export as HTML. Please try again.");
            }
        } catch (error) {
            if (error.message === 'TokenExpired') {
                // Go back to login page
                navigate('/login');
            }

            console.error("Error exporting as HTML:", error);
            alert("An error occurred while exporting as HTML. Please try again.");
        }
    }

    const handleLogout = async () => {
        logout();
        navigate('/login');
    }

    // Utility function to reduce repeating code patterns
    const downloadFile = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        if(type == 'text/markdown')
            link.download = `${filename}.md`;
        else if (type == 'text/html')
            link.download = `${filename}.html`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="user-bar">
            <div className="user-bar-left-container">
                {(props.showGrammarView && !props.isCheckingGrammar) ? <AcceptChangesWindow /> : <></>}
            </div>
            <p className="save-state">{props.saveState ? "Saved" : "Unsaved"}</p>
            <div className="user-bar-buttons-container">
                <button className="user-bar-buttons" onClick={async () => {
                    try {
                        await handleFileContentSave(props.fileGuid, props.fileCurrentContent, handleSaveSuccess)
                    } catch (error) {
                        if (error.message === 'TokenExpired') {
                            navigate('/login');
                        }
                    }
                }}>Save</button>
                <button className="user-bar-buttons" onClick={ handleGrammarCheck }>Check for Grammar</button>
                <button className="user-bar-buttons" onClick={ handleExportAsMarkdown }>Export as Markdown</button>
                <button className="user-bar-buttons" onClick={ handleExportAsHtml }>Export as HTML</button>
                <button className="user-bar-buttons" onClick={ handleLogout } id="logout-btn">Logout</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
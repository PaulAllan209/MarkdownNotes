import './UserWindowBar.css';
import AcceptChangesWindow from './AcceptChangesWindow';
import { handleFileContentSave, handleFileGet } from '../../utils/apiUtils.js';
import { useNavigate } from 'react-router-dom';


function UserWindowBar(props) {

    const navigate = useNavigate();

    const handleSaveSuccess = () => {
        props.setSaveState(true);
    }

    const handleGrammarCheck = () => {
        try {
            handleFileContentSave(props.fileGuid, props.fileCurrentContent, handleSaveSuccess); //Saves the file to the database first before checking for grammar.
        } catch (error) {
            if (error.message === 'TokenExpired') {
                // Go back to login page
                navigate('/login');
            }
        }
        props.setShowGrammarView(true);
    }

    const handleExportAsMarkdown = () => {
        const markdownContent = props.fileCurrentContent;
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${props.fileTitle}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Clean up the URL object
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
                const htmlContent = data.fileContentAsHtml;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `${props.fileTitle}.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url); // Clean up the URL object
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

    return (
        <div className="user-bar">
            <div className="user-bar-left-container">
                {props.showGrammarView ? <AcceptChangesWindow /> : <></>}
            </div>
            <p className="save-state">{props.saveState ? "Saved" : "Unsaved"}</p>
            <div className="user-bar-buttons-container">
                <button className="user-bar-buttons" onClick={() => handleFileContentSave(props.fileGuid, props.fileCurrentContent, handleSaveSuccess)}>Save</button>
                <button className="user-bar-buttons" onClick={handleGrammarCheck}>Check for Grammar</button>
                <button className="user-bar-buttons" onClick={handleExportAsMarkdown}>Export as Markdown</button>
                <button className="user-bar-buttons" onClick={handleExportAsHtml}>Export as HTML</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
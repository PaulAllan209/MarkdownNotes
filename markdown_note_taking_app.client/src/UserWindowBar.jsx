import './UserWindowBar.css';
import AcceptChangesWindow from './AcceptChangesWindow';
import { handleFileContentSave } from './utils/apiUtils';

function UserWindowBar(props) {

    const handleSaveSuccess = () => {
        props.setSaveState(true);
    }

    const handleGrammarCheck = () => {
        handleFileContentSave(props.fileGuid, props.fileCurrentContent, handleSaveSuccess); //Saves the file to the database first before checking for grammar.
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
                <button className="user-bar-buttons">Export as HTML</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
import './UserWindowBar.css';
import AcceptChangesWindow from './AcceptChangesWindow';
import { handleFileContentSave } from './utils/apiUtils';

function UserWindowBar(props) {

    const handleSaveSuccess = () => {
        props.setSaveState(true);
    }

    const handleGrammarCheck = () => {
        props.setShowGrammarView(true);
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
                <button className="user-bar-buttons">Export as Markdown</button>
                <button className="user-bar-buttons">Export as HTML</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
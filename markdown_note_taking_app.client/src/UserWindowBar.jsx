import './UserWindowBar.css';

function UserWindowBar(props) {

    const handleSave = () => {
        props.setSaveState(true);
    }

    return (
        <div className="user-bar">
            <p className="save-state">{ props.saveState ? "Saved" : "Unsaved"}</p>
            <div className="user-bar-buttons-container">
                <button className="user-bar-buttons" onClick={handleSave}>Save</button>
                <button className="user-bar-buttons">Export as Markdown</button>
                <button className="user-bar-buttons">Export as HTML</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
import './UserWindowBar.css';

function UserWindowBar(props) {

    const handleSave = (fileId, fileCurrentContent) => {
        const patchDocument = [
            {
            "op": "replace",
            "path": "/fileContent",
            "value": fileCurrentContent
            }
        ];

        fetch(`https://localhost:7271/api/markdown/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(patchDocument)
        })
            .then(response => {
                if (response.ok) {
                    console.log("Successfully saved the file to the database.");
                    props.setSaveState(true);
                }
                else {
                    console.error("Failed to save the file");
                    alert("Failed to save the file");
                }
            });
    }

    const handleGrammarCheck = (fileId) => {
        props.setShowGrammarView(true);

        fetch(`https://localhost:7271/api/markdown/${fileId}`)
    }

    return (
        <div className="user-bar">
            <p className="save-state">{ props.saveState ? "Saved" : "Unsaved"}</p>
            <div className="user-bar-buttons-container">
                <button className="user-bar-buttons" onClick={() => handleSave(props.fileGuid, props.fileCurrentContent)}>Save</button>
                <button className="user-bar-buttons" onClick={handleGrammarCheck}>Check for Grammar</button>
                <button className="user-bar-buttons">Export as Markdown</button>
                <button className="user-bar-buttons">Export as HTML</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
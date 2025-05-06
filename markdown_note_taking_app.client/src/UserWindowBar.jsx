import './UserWindowBar.css';

function UserWindowBar() {
    return (
        <div className="user-bar">
            <div className="user-bar-buttons-container">
                <button className="user-bar-buttons">Export as Markdown</button>
                <button className="user-bar-buttons">Export as HTML</button>
                <button className="user-bar-buttons">Save</button>
            </div>
        </div>
  );
}

export default UserWindowBar;
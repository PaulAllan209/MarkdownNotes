import './AcceptChangesWindow.css';

function AcceptChangesWindow() {
    return (
       <div className="accept-changes-window">
            <div className="accept-changes-text">
                Accept Changes?
            </div>
            <button className="accept-button">&#10003;</button>
            <button className="reject-button">&#10007;</button>
      </div>
  );
}

export default AcceptChangesWindow;
import "./EditingWindow.css"

function EditingWindow(props) {

    const handleContentChange = (e) => {
        props.setContent(e.target.value);
    };

  return (
      <div className="editing-window">
          <textarea
              className="input-editing-window"
              value={props.selectedFileContent}
              onChange={handleContentChange}>
          </textarea>
      </div>
  );
}

export default EditingWindow;
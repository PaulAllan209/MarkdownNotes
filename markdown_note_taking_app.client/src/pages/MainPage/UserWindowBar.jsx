import './UserWindowBar.css';
import AcceptChangesWindow from './AcceptChangesWindow';
import { handleFileContentSave, handleFileGet } from '../../utils/apiUtils.js';
import { logout } from '../../utils/authenticationUtils.js';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';


function UserWindowBar(props) {

    const navigate = useNavigate();
    const editorRef = useRef(null);

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

    const handleBoldClick = () => {
        const textArea = props.editorRef.current;
        if (!textArea) return;

        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;

        // Only proceed if there's a selection
        if (start !== end) {
            const selectedText = props.fileCurrentContent.substring(start, end);
            let newContent;
            let newCursorPos;

            // Check if the selected text is already bold
            if ((props.fileCurrentContent.substring(start - 2, start) === '**') && (props.fileCurrentContent.substring(end, end + 2) === '**')) {
                // Remove bold formatting
                newContent =
                    props.fileCurrentContent.substring(0, start - 2) +
                    selectedText +
                    props.fileCurrentContent.substring(end + 2);

                // Adjust cursor position
                newCursorPos = {
                    start: start - 2,
                    end: end - 2 // Adjust for the removal of 4 characters (two asterisks on each side)
                };
            } else {
                // Add bold formatting
                newContent =
                    props.fileCurrentContent.substring(0, start) +
                    `**${selectedText}**` +
                    props.fileCurrentContent.substring(end);

                // Adjust cursor position
                newCursorPos = {
                    start: start + 2,
                    end: end + 2
                };
            }

            props.setFileCurrentContent(newContent);
            props.setSaveState(false);

            // Set the cursor position after the operation
            setTimeout(() => {
                textArea.focus();
                textArea.setSelectionRange(newCursorPos.start, newCursorPos.end);
            }, 0);
        }
    };

    const handleItalicClick = () => {
        const textArea = props.editorRef.current;
        if (!textArea) return;

        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;

        // Only proceed if there's a selection
        if (start !== end) {
            const selectedText = props.fileCurrentContent.substring(start, end);
            let newContent;
            let newCursorPos;

            // Check if the selected text is already bold
            if ((props.fileCurrentContent.substring(start - 1, start) === '*') && (props.fileCurrentContent.substring(end, end + 1) === '*')) {
                // Remove bold formatting
                newContent =
                    props.fileCurrentContent.substring(0, start - 1) +
                    selectedText +
                    props.fileCurrentContent.substring(end + 1);

                // Adjust cursor position
                newCursorPos = {
                    start: start - 1,
                    end: end - 1 // Adjust for the removal of 4 characters (two asterisks on each side)
                };
            } else {
                // Add bold formatting
                newContent =
                    props.fileCurrentContent.substring(0, start) +
                    `*${selectedText}*` +
                    props.fileCurrentContent.substring(end);

                // Adjust cursor position
                newCursorPos = {
                    start: start + 1,
                    end: end + 1
                };
            }

            props.setFileCurrentContent(newContent);
            props.setSaveState(false);

            // Set the cursor position after the operation
            setTimeout(() => {
                textArea.focus();
                textArea.setSelectionRange(newCursorPos.start, newCursorPos.end);
            }, 0);
        }
    };

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
                <div className="user-bar-tool-buttons-container">
                    <button className="user-bar-tool-buttons" onClick={handleBoldClick}><img className="user-bar-tool-icons" src="/assets/button_icons/bold-text.png" /></button>
                    <button className="user-bar-tool-buttons" onClick={handleItalicClick}><img className="user-bar-tool-icons" src="/assets/button_icons/italic-font.png" /></button>
                    <button className="user-bar-tool-buttons"><img className="user-bar-tool-icons" src="/assets/button_icons/strikethrough.png" /></button>
                    <button className="user-bar-tool-buttons"><img className="user-bar-tool-icons" src="/assets/button_icons/unordered_list.png" /></button>
                    <button className="user-bar-tool-buttons"><img className="user-bar-tool-icons" src="/assets/button_icons/ordered_list.png" /></button>
                    <button className="user-bar-tool-buttons"><img className="user-bar-tool-icons" src="/assets/button_icons/programming-code-signs.png" /></button>
                </div>
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
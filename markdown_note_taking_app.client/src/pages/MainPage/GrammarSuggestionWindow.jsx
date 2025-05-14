import './GrammarSuggestionWindow.css';
import Markdown from 'react-markdown';
import AcceptChangesWindow from './AcceptChangesWindow';

function GrammarSuggestionWindow(props) {
    return (
        <div className="grammar-window">
          <Markdown>{props.grammarCheckedFileContent}</Markdown>
      </div>
  );
}

export default GrammarSuggestionWindow;
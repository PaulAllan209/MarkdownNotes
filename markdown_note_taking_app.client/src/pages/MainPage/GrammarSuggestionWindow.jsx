import './GrammarSuggestionWindow.css';
import Markdown from 'react-markdown';
import { SpinnerLoading } from "../../components/SpinnerLoading.jsx";

function GrammarSuggestionWindow(props) {

    return (
      <div className="grammar-window">
            <Markdown>{props.grammarCheckedFileContent}</Markdown>
            {props.isCheckingGrammar ?
                <div className="spinner-icon">
                    <SpinnerLoading />
                </div>
                : <></>}
      </div>
  );
}

export default GrammarSuggestionWindow;
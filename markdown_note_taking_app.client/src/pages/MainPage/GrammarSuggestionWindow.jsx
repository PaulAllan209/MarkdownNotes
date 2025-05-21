import './GrammarSuggestionWindow.css';
import Markdown from 'react-markdown';
import { SpinnerLoading } from "../../components/SpinnerLoading.jsx";
import React, { useEffect } from 'react';

function GrammarSuggestionWindow(props) {
    useEffect(() => {
        if (props.isCheckingGrammar) {
            console.log("Is checking grammar set to true in GrammarSuggestionWindow.jsx");
        }
    }, [props.isCheckingGrammar]);

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
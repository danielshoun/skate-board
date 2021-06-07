import React, {useEffect, useState} from "react";
import "./BBCodeBar.css";

const BBCodeBar = ({inputRef, setter}) => {
    const [input, setInput] = useState(inputRef.current);

    useEffect(() => {
        setInput(inputRef.current);
    }, [inputRef]);

    function handleBBCodeInsert(type) {
        let openTag, closeTag;
        switch (type) {
            case "bold":
                openTag = "[b]";
                closeTag = "[/b]";
                break;
            case "italic":
                openTag = "[i]";
                closeTag = "[/i]";
                break;
            case "underline":
                openTag = "[u]";
                closeTag = "[/u]";
                break;
            case "strike":
                openTag = "[s]";
                closeTag = "[/s]";
                break;
            case "super":
                openTag = "[super]";
                closeTag = "[/super]";
                break;
            case "sub":
                openTag = "[sub]";
                closeTag = "[/sub]";
                break;
            case "link":
                openTag = "[url=]";
                closeTag = "[/url]";
                break;
            case "image":
                openTag = "[img]";
                closeTag = "[/img]";
                break;
            default:
                openTag = "[b]";
                closeTag = "[/b]";
                break;
        }
        const startSelect = input.selectionStart;
        const endSelect = input.selectionEnd;
        const textBeforeSelect = input.value.substring(0, startSelect);
        const textInSelect = input.value.substring(startSelect, endSelect);
        const textAfterSelect = input.value.substring(endSelect, input.value.length);
        setter(input.value = textBeforeSelect + openTag + textInSelect + closeTag + textAfterSelect);
    }

    return (
        <div className="bb-code-bar">
            <div className="format-buttons">
                <i className="fas fa-bold bb-code-icon" onClick={() => handleBBCodeInsert("bold")}/>
                <i className="fas fa-italic bb-code-icon" onClick={() => handleBBCodeInsert("italic")}/>
                <i className="fas fa-underline bb-code-icon" onClick={() => handleBBCodeInsert("underline")}/>
                <i className="fas fa-strikethrough bb-code-icon" onClick={() => handleBBCodeInsert("strike")}/>
                <i className="fas fa-superscript bb-code-icon" onClick={() => handleBBCodeInsert("super")}/>
                <i className="fas fa-subscript bb-code-icon" onClick={() => handleBBCodeInsert("sub")}/>
                <i className="fas fa-link bb-code-icon" onClick={() => handleBBCodeInsert("link")}/>
                <i className="fas fa-image bb-code-icon" onClick={() => handleBBCodeInsert("image")}/>
            </div>
            <i className="fas fa-smile bb-code-icon"/>
        </div>
    );
};

export default BBCodeBar;

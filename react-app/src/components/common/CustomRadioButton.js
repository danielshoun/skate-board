import React from "react";
import "./CustomRadioButton.css";

const CustomRadioButton = ({setter, currentValue, targetValue, text}) => {
    return (
        <div className="radio-button">
            <div
                className="radio"
                onClick={() => setter(targetValue)}
            >
                <div className={`radio-inner${currentValue === targetValue ? " active-radio" : ""}`}/>
            </div>
            {text}
        </div>
    );
};

export default CustomRadioButton;

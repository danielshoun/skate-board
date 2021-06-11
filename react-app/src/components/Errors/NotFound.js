import React from "react";
import "./Errors.css";

const NotFound = ({error}) => {
    return (
        <div className="error-container">
            <div className="error-header">404'd!</div>
            <div className="error-description">
                We couldn't find what you were looking for. The server responded with the following error:
            </div>
            <div className="error-page-container">
                <div>{error}</div>
            </div>
        </div>
    );
};

export default NotFound;

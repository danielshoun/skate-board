import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import "./PageController.css";

const PageController = ({pageNum, pageCount, pageSetter}) => {
    const history = useHistory();
    const location = useLocation();

    function handlePageSwitch(destination) {
        let newPath = location.pathname + location.search;
        if (newPath.includes("page")) {
            newPath = newPath.split("=");
            newPath = newPath.slice(0, newPath.length - 1);
            newPath = newPath.join("=") + "=";
        } else {
            if (newPath.includes("?")) newPath += "&"
            else newPath += "?page="
        }
        if (destination === "first") {
            pageSetter(1);
            newPath += 1;
        } else if (destination === "prev") {
            pageSetter(pageNum - 1);
            newPath += (pageNum - 1);
        } else if (destination === "next") {
            pageSetter(pageNum + 1);
            newPath += (pageNum + 1);
        } else if (destination === "last") {
            pageSetter(pageCount);
            newPath += pageCount;
        } else {

        }
        history.push(newPath);
    }

    return (
        <div className="page-controller">
            {pageNum !== 1 &&
            (<>
                <span
                    className="page-link page-1-link"
                    onClick={() => handlePageSwitch("first")}
                >
                    {"<<"}
                </span>
                <span
                    className="page-link prev-page-link"
                    onClick={() => handlePageSwitch("prev")}
                >
                    {"<"}
                </span>
            </>)}
            <div className="page-selector">{pageNum}</div>
            {pageNum !== pageCount &&
            (<>
                <span
                    className="page-link next-page-link"
                    onClick={() => handlePageSwitch("next")}
                >
                    {">"}
                </span>
                <span
                    className="page-link last-page-link"
                    onClick={() => handlePageSwitch("last")}
                >
                    {">>"}
                </span>
            </>)}
        </div>
    );
};

export default PageController;

import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import "./PageController.css";

const PageController = ({pageNum, pageCount, pageSetter}) => {
    const history = useHistory();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (e.target.className !== "page-dropdown-item") {
                setDropdownOpen(false);
            }
        }
        if(dropdownOpen === true) {
            document.addEventListener("click", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [dropdownOpen])

    function handlePageSwitch(e, destination) {
        e.stopPropagation();
        let newPath = location.pathname + location.search;
        if (newPath.includes("page")) {
            newPath = newPath.split("=");
            newPath = newPath.slice(0, newPath.length - 1);
            newPath = newPath.join("=") + "=";
        } else {
            if (newPath.includes("?")) newPath += "&page=";
            else newPath += "?page=";
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
            pageSetter(destination);
            newPath += destination;
        }
        setDropdownOpen(false);
        history.push(newPath);
    }

    return (
        <div className="page-controller">
            {pageNum !== 1 &&
            (<>
                <span
                    className="page-link page-1-link"
                    onClick={(e) => handlePageSwitch(e, "first")}
                >
                    {"<<"}
                </span>
                <span
                    className="page-link prev-page-link"
                    onClick={(e) => handlePageSwitch(e, "prev")}
                >
                    {"<"}
                </span>
            </>)}
            <div
                className="page-selector"
                onClick={() => setDropdownOpen(prevState => !prevState)}
            >
                {pageNum}
                <i className={`fas fa-chevron-down dropdown-chevron page-chevron${dropdownOpen ? " active-chevron" : ""}`}/>
                {dropdownOpen &&
                <div className="page-dropdown">
                    {Array.from({length: pageCount}, (x, i) => i + 1).map(num => {
                        return (
                            <div
                                key={num}
                                className="page-dropdown-item"
                                onClick={(e) => handlePageSwitch(e, num)}
                            >
                                {num}
                            </div>
                        );
                    })}
                </div>
                }
            </div>
            {pageNum !== pageCount &&
            (<>
                <span
                    className="page-link next-page-link"
                    onClick={(e) => handlePageSwitch(e, "next")}
                >
                    {">"}
                </span>
                <span
                    className="page-link last-page-link"
                    onClick={(e) => handlePageSwitch(e, "last")}
                >
                    {">>"}
                </span>
            </>)}
        </div>
    );
};

export default PageController;

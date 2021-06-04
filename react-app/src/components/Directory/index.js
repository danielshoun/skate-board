import React, {useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import "./Directory.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Directory = () => {
    const query = useQuery();
    const history = useHistory();
    const [searchInput, setSearchInput] = useState("");

    function handleSearchEnter(e) {
        if(e.key === "Enter") {
            history.push(`/directory?search=${searchInput}`)
        }
    }

    return (
        <div className="directory-container">
            <div className="directory-search-container">
                <input
                    className="directory-search-bar"
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchEnter}
                />
                <button className="btn-secondary directory-search-btn">Search</button>
            </div>
        </div>
    );
};

export default Directory;

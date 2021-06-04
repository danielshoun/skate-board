import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import "./Directory.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Directory = () => {
    const query = useQuery();
    const [searchTerm, setSearchTerm] = useState(query.get("search"));
    const [pageNum, setPageNum] = useState(query.get("page"));
    const [pageCount, setPageCount] = useState(1);
    const history = useHistory();
    const [searchInput, setSearchInput] = useState("");
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch(
                `/api/boards?` +
                `${searchTerm ? `search=${searchTerm}${pageNum ? "&" : ""}` : ""}` +
                `${pageNum ? `page=${pageNum}` : ""}`
            );
            if (res.ok) {
                const data = await res.json();
                setBoards(data.boards);
                setPageCount(data.page_count);
            }
        })();
    }, [searchTerm, pageNum]);

    function handleSearchEnter(e) {
        if (e.key === "Enter") {
            history.push(`/directory?search=${searchInput}`);
            setSearchTerm(searchInput);
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
            <div className="directory-content-container">
                <div className="directory-content-header">
                    <span>
                        {query.get("search") ? `SEARCH FOR: ${query.get("search").toUpperCase()}` : "PUBLIC BOARDS"} -
                        PAGE {query.get("page") || 1}
                    </span>
                </div>
                <div className="directory-board-list">
                    {boards.map(board => {
                        return (
                            <div className="directory-board-item" key={board.id}>
                                <div className="directory-board-about-info">
                                    <div className="directory-board-name">
                                        {board.name}
                                    </div>
                                    <div className="directory-board-description">
                                        {board.description}
                                    </div>
                                </div>
                                <div className="directory-board-controls">
                                    <div className="directory-board-users">
                                        {board.member_count} user{board.member_count > 1 ? "s" : ""}
                                    </div>
                                    <button className="btn-primary directory-join-button">Join</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="directory-content-header directory-content-footer">
                    {query.get("search") ? `SEARCH FOR: ${query.get("search").toUpperCase()}` : "PUBLIC BOARDS"} -
                    PAGE {query.get("page") || 1}
                </div>
            </div>
        </div>
    );
};

export default Directory;

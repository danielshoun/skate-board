import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "./Directory.css";
import JoinLeaveButton from "../common/JoinLeaveButton";
import PageController from "../common/PageController";
import useQuery from "../../utils/useQuery";

const Directory = () => {
    const user = useSelector(state => state.session.user);
    const query = useQuery();
    const [searchTerm, setSearchTerm] = useState(query.get("search"));
    const [pageNum, setPageNum] = useState(Number(query.get("page")) || 1);
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
                setPageCount(data.page_count || 1);
            }
        })();
    }, [searchTerm, pageNum]);

    function handleSearchEnter(e) {
        if (e.key === "Enter" || e.target.tagName === "BUTTON") {
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
                <button
                    className="btn-secondary directory-search-btn"
                    onClick={handleSearchEnter}
                >
                    Search
                </button>
            </div>
            <div className="directory-content-container">
                <div className="directory-content-header">
                    <div className="directory-header-info">
                        {query.get("search") ? `SEARCH FOR: ${query.get("search").toUpperCase()}` : "PUBLIC BOARDS"} -
                        PAGE {pageNum || 1}
                    </div>
                    {boards.length > 0 &&
                    <PageController
                        pageCount={pageCount}
                        pageNum={pageNum}
                        pageSetter={setPageNum}
                    />
                    }
                </div>
                <div className="directory-board-list">
                    {boards.length === 0 && searchTerm &&
                    <div className="no-results-info">
                        Your search for "{searchTerm}" did not yield any results.
                    </div>
                    }
                    {boards.map(board => {
                        const userIsMember = user && board.id in user.boards_joined;

                        return (
                            <div className="directory-board-item"
                                 key={board.id}
                                 onClick={() => history.push(`/board/${board.id}`)}
                            >
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
                                        {board.member_count} USER{board.member_count > 1 ? "S" : ""}
                                    </div>
                                    {user &&
                                    <JoinLeaveButton
                                        userIsMember={userIsMember}
                                        board={board}
                                        setBoards={setBoards}
                                    />
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
                {boards.length > 0 &&
                <div className="directory-content-header directory-content-footer">
                    <div className="directory-header-info">
                        {query.get("search") ? `SEARCH FOR: ${query.get("search").toUpperCase()}` : "PUBLIC BOARDS"} -
                        PAGE {pageNum || 1}
                    </div>
                    <PageController pageCount={pageCount} pageNum={pageNum} pageSetter={setPageNum}/>
                </div>
                }
            </div>
        </div>
    );
};

export default Directory;

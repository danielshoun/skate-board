import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams, useHistory, Link} from "react-router-dom";
import "./Board.css";
import useQuery from "../../utils/useQuery";
import JoinLeaveButton from "../common/JoinLeaveButton";
import PageController from "../common/PageController";
import ThreadPageLinks from "./ThreadPageLinks";

const Board = () => {
    const query = useQuery();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const {boardId} = useParams();
    const [board, setBoard] = useState({});
    const [threads, setThreads] = useState([]);
    const [pageNum, setPageNum] = useState(Number(query.get("page")) || 1);
    const [pageCount, setPageCount] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState(query.get("search"));
    const [userIsMember, setUserIsMember] = useState(false);

    useEffect(() => {
        (async () => {
                const res = await fetch(`/api/boards/${boardId}?` +
                    `${searchTerm ? `search=${searchTerm}${pageNum ? "&" : ""}` : ""}` +
                    `${pageNum ? `page=${pageNum}` : ""}`);
                if (res.ok) {
                    const data = await res.json();
                    setBoard(data.board);
                    setThreads(data.threads);
                    setPageCount(data.page_count);
                }
            }
        )();
    }, [boardId, pageNum, searchTerm]);

    useEffect(() => {
        setUserIsMember(user && board.id in user.boards_joined);
    }, [user, board]);

    function handleSearchEnter(e) {
        if (e.key === "Enter" || e.target.tagName === "BUTTON") {
            history.push(`/board/${boardId}?search=${searchInput}`);
            setSearchTerm(searchInput);
        }
    }

    function getDateString(isoDate) {
        const dateObj = new Date(isoDate + "Z");
        let timeString;
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        timeString = `${dateObj.getMonth() + 1}/${
            dateObj.getDate()
        }/${dateObj.getFullYear()}, ${hours}:${minutes} ${ampm}`;
        return timeString;
    }

    return (
        <div className="board-container">
            <div className="board-info-container">
                <div className="board-about-info">
                    <div className="board-info-name">
                        {board.name}
                    </div>
                    <div className="board-info-description">
                        {board.description}
                    </div>
                </div>
                <div className="board-controls">
                    <div className="board-users">
                        {board.member_count} USER{board.member_count > 1 ? "S" : ""}
                    </div>
                    {user &&
                    <JoinLeaveButton
                        userIsMember={userIsMember}
                        board={board}
                        setBoard={setBoard}
                    />
                    }
                    {user && board.owner_id === user.id &&
                    <button
                        className="btn-secondary board-edit-btn"
                        onClick={() => history.push(`/board/${boardId}/edit`)}
                    >
                        EDIT
                    </button>
                    }
                </div>
            </div>
            <div className="board-content-container">
                <div className="board-control-container">
                    <div className="board-search-container">
                        <input
                            className="directory-search-bar"
                            type="text"
                            placeholder="Search Threads..."
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
                    <button
                        className="btn-primary new-thread-btn"
                        onClick={() => history.push(`/board/${boardId}/new`)}
                    >
                        POST
                    </button>
                </div>
                <div className="directory-content-header">
                    <div className="directory-header-info">
                        {searchTerm && `SEARCH FOR "${searchTerm.toUpperCase()}" IN `}
                        {board.name?.toUpperCase()} -
                        PAGE {pageNum || 1}
                    </div>
                    {threads.length > 0 &&
                    <PageController
                        pageCount={pageCount}
                        pageNum={pageNum}
                        pageSetter={setPageNum}
                    />
                    }
                </div>
                <div className="board-thread-list">
                    {threads.length === 0 &&
                    <div className="no-results-info">
                        {searchTerm ?
                            `Your search for ${searchTerm} did not yield any results.` :
                            "This board doesn't have any threads yet. Get the conversation started!"
                        }
                    </div>
                    }
                    {threads.map(thread => {
                        const dateTimeStrings = getDateString(thread.last_post_time);
                        return (
                            <div
                                key={thread.id}
                                className="board-thread-item"
                            >
                                <div className="thread-item-info">
                                    <Link className="thread-item-link" to={`/board/${board.id}/thread/${thread.id}`}>
                                        <div className="thread-item-title">
                                            {thread.pinned && <i className="fas fa-thumbtack pinned-thread-icon"/>}
                                            {thread.locked && <i className="fas fa-lock pinned-thread-icon"/>}
                                            {thread.title}
                                        </div>
                                    </Link>
                                    <ThreadPageLinks thread={thread}/>
                                </div>
                                <div className="thread-item-sort">
                                    <div className="thread-date-info">
                                        {dateTimeStrings}
                                    </div>
                                    <div className="thread-author-info">
                                        by {thread.last_post_author}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Board;

import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams, Link} from "react-router-dom";
import "./Board.css";
import useQuery from "../../utils/useQuery";
import JoinLeaveButton from "../common/JoinLeaveButton";
import PageController from "../common/PageController";

const Board = () => {
    const query = useQuery();
    const user = useSelector(state => state.session.user);
    const {boardId} = useParams();
    const [board, setBoard] = useState({});
    const [threads, setThreads] = useState([]);
    const [pageNum, setPageNum] = useState(Number(query.get("page")) || 1);
    const [pageCount, setPageCount] = useState(1);
    const [userIsMember, setUserIsMember] = useState(false);

    useEffect(() => {
        (async () => {
                const res = await fetch(`/api/boards/${boardId}${pageNum > 1 ? `?page=${pageNum}` : ""}`);
                if (res.ok) {
                    const data = await res.json();
                    setBoard(data.board);
                    setThreads(data.threads);
                    setPageCount(data.page_count);
                }
            }
        )();
    }, [boardId, pageNum]);

    useEffect(() => {
        setUserIsMember(user && board.id in user.boards_joined);
    }, [user, board]);

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
                    <button className="btn-secondary board-edit-btn">EDIT</button>
                    }
                </div>
            </div>
            <div className="board-content-container">
                <div className="directory-content-header">
                    <div className="directory-header-info">
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
                        This board doesn't have any threads yet. Get the conversation started!
                    </div>
                    }
                    {threads.map(thread => {
                        const threadPageCount = Math.ceil(thread.post_count / 40);
                        // const threadPageCount = 20;
                        return (
                            <div
                                key={thread.id}
                                className="board-thread-item"
                            >
                                <div className="thread-item-info">
                                    <div className="thread-item-title">
                                        {thread.title}
                                    </div>
                                    <div className="thread-item-page-links">
                                        Pages:{
                                        threadPageCount < 10 ?
                                            Array.from({length: pageCount}, (x, i) => i + 1)
                                                .map(num => {
                                                    return (
                                                        <Link
                                                            className="thread-page-link"
                                                            to={`/thread?page=${num}`}
                                                        >
                                                            {num}
                                                        </Link>
                                                    );
                                                }) :
                                            <>
                                                {
                                                    Array.from({length: 3}, (x, i) => i + 1)
                                                        .map(num => {
                                                            return (
                                                                <Link
                                                                    className="thread-page-link"
                                                                    to={`/thread?page=${num}`}
                                                                >
                                                                    {num}
                                                                </Link>
                                                            );
                                                        })
                                                }
                                                <span className="page-link-separator">...</span>
                                                {
                                                    Array.from({length: 3}, (x, i) => i + (threadPageCount - 2))
                                                        .map(num => {
                                                            return (
                                                                <Link
                                                                    className="thread-page-link"
                                                                    to={`/thread?page=${num}`}
                                                                >
                                                                    {num}
                                                                </Link>
                                                            );
                                                        })
                                                }
                                            </>
                                    }
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

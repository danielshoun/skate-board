import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import useQuery from "../../utils/useQuery";
import "./Thread.css";
import PageController from "../common/PageController";
import Post from "../common/Post";

const Thread = () => {
    const user = useSelector(state => state.session.user);
    const query = useQuery();
    const {threadId} = useParams();
    const history = useHistory();
    const [board, setBoard] = useState({});
    const [thread, setThread] = useState({});
    const [posts, setPosts] = useState([]);
    const [pageNum, setPageNum] = useState(Number(query.get("page")) || 1);
    const [pageCount, setPageCount] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState(query.get("search"));

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/threads/${threadId}?` +
                `${searchTerm ? `search=${searchTerm}${pageNum ? "&" : ""}` : ""}` +
                `${pageNum ? `page=${pageNum}` : ""}`);
            if (res.ok) {
                const data = await res.json();
                setBoard(data.board);
                setThread(data.thread);
                setPosts(data.posts);
                setPageCount(data.page_count);
            }
        })();
    }, [threadId, pageNum, searchTerm]);

    function handleSearchEnter(e) {
        if (e.key === "Enter" || e.target.tagName === "BUTTON") {
            history.push(`/board/${board.id}/thread/${thread.id}?search=${searchInput}`);
            setSearchTerm(searchInput);
        }
    }

    return (
        <div className="thread-container">
            <div className="thread-control-container">
                <div className="thread-search-container">
                    <input
                        className="directory-search-bar"
                        type="text"
                        placeholder="Search Posts..."
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
                <div>
                    {thread.owner_id === user.id &&
                    <button
                        className="btn-secondary new-reply-btn"
                        onClick={() => history.push(`/board/${board.id}/thread/${thread.id}/edit`)}
                    >
                        EDIT
                    </button>
                    }
                    <button
                        className="btn-primary new-reply-btn"
                        onClick={() => history.push(`/board/${board.id}/thread/${thread.id}/post`)}
                    >
                        REPLY
                    </button>
                </div>
            </div>
            <div className="directory-content-header">
                <div className="directory-header-info">
                    {searchTerm && `SEARCH FOR "${searchTerm.toUpperCase()}" IN `}
                    {`${board.name?.toUpperCase() || ""} > ${thread.title?.toUpperCase() || ""}`} -
                    PAGE {pageNum || 1}
                </div>
                {posts.length > 0 &&
                <PageController
                    pageCount={pageCount}
                    pageNum={pageNum}
                    pageSetter={setPageNum}
                />
                }
            </div>
            <div className="thread-post-list">
                {posts.length === 0 &&
                <div className="no-results-info">
                    {searchTerm ?
                        `Your search for ${searchTerm} did not yield any results.` :
                        "Loading posts..."
                    }
                </div>
                }
                {posts.map(post => {
                    return (
                        <Post key={post.id} post={post} thread={thread} board={board}/>
                    );
                })}
            </div>
            <div className="directory-content-header directory-content-footer">
                <div className="directory-header-info">
                    {searchTerm && `SEARCH FOR "${searchTerm.toUpperCase()}" IN `}
                    {`${board.name?.toUpperCase() || ""} > ${thread.title?.toUpperCase() || ""}`} -
                    PAGE {pageNum || 1}
                </div>
                {posts.length > 0 &&
                <PageController
                    pageCount={pageCount}
                    pageNum={pageNum}
                    pageSetter={setPageNum}
                />
                }
            </div>
            <div className="footer-reply-button-container">
                {thread.owner_id === user.id &&
                <button
                    className="btn-secondary new-reply-btn"
                    onClick={() => history.push(`/board/${board.id}/thread/${thread.id}/edit`)}
                >
                    EDIT
                </button>
                }
                <button
                    className="btn-primary new-reply-btn"
                    onClick={() => history.push(`/board/${board.id}/thread/${thread.id}/post`)}
                >
                    REPLY
                </button>
            </div>
        </div>
    );
};
export default Thread;

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import useQuery from "../../utils/useQuery";
import "./Thread.css";

const Thread = () => {
    const query = useQuery();
    const {threadId} = useParams();
    const [board, setBoard] = useState();
    const [thread, setThread] = useState();
    const [posts, setPosts] = useState([]);
    const [pageNum, setPageNum] = useState(Number(query.get("page")) || 1);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/threads/${threadId}`);
            if (res.ok) {
                const data = await res.json();
                setBoard(data.board);
                setThread(data.thread);
                setPosts(data.posts);
                setPageCount(data.page_count);
            }
        })();
    }, [threadId]);

    return (
        <div className="thread-container">
        </div>
    );
};

export default Thread;

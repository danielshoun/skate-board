import React, {useRef, useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
// import "./NewThread.css";
import BBCodeBar from "../common/BBCodeBar";
import NotFound from "../Errors/NotFound";
import DeletePostModal from "./DeletePostModal";
// import DeleteThreadModal from "./DeleteThreadModal";

const NewReply = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const {boardId, threadId, postId} = useParams();
    const [thread, setThread] = useState({});
    const [postText, setPostText] = useState("");
    const [errors, setErrors] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadError, setLoadError] = useState("");
    const textRef = useRef();

    useEffect(() => {
        (async () => {
            if (postId) {
                const res = await fetch(`/api/posts/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.post.owner_id === user?.id) {
                        setPostText(data.post.body);
                        setThread(data.thread);
                    } else {
                        setLoadError("You must be the owner of a post to edit it.");
                    }
                } else {
                    const data = await res.json();
                    setLoadError(data.errors);
                }
            } else {
                const res = await fetch(`/api/threads/${threadId}`);
                if (res.ok) {
                    const data = await res.json();
                    setThread(data.thread);
                } else {
                    const data = await res.json();
                    setLoadError(data.errors);
                }
            }
        })();
    }, [user, postId, threadId]);

    function openModal(e) {
        e.preventDefault();
        setModalOpen(true);
    }

    function closeModal(e) {
        e.stopPropagation();
        setModalOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const body = {
            thread_id: threadId,
            body: postText
        };
        let res;
        if (postId) {
            res = await fetch(`/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        } else {
            res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        }
        if (res.ok) {
            const data = await res.json();
            if (data.errors) {
                setErrors(data.errors);
            } else {
                history.push(`/board/${boardId}/thread/${data.thread_id}`);
            }
        } else {
            const data = await res.json();
            if (data.errors) {
                setErrors(data.errors);
            }
        }
    }

    if (loadError) {
        return (
            <NotFound error={loadError}/>
        );
    }

    return (
        <div className="new-thread-container">
            <form
                className="new-thread-form"
                onSubmit={handleSubmit}
            >
                <div
                    className="new-thread-header">{postId ? "EDITING POST IN" : "REPLYING TO"} "{thread.title?.toUpperCase()}"
                </div>
                <div className="new-thread-form-field">
                    <label
                        className="new-thread-form-label"
                        htmlFor="description"
                    >
                        POST TEXT
                    </label>
                    <BBCodeBar inputRef={textRef} setter={setPostText} boardId={boardId}/>
                    <textarea
                        className="new-thread-form-input"
                        name="name"
                        rows={3}
                        value={postText}
                        ref={textRef}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                    <div className="log-reg-error-div">
                        {errors.body && errors.body.map((error, i) => {
                            return (
                                <div key={i}>{error}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="new-board-btn-container">
                    {postId ?
                        <button
                            className="btn-red delete-board-btn"
                            onClick={openModal}
                        >
                            DELETE
                        </button> : <div/>
                    }
                    <div>
                        <button
                            className="btn-primary new-board-btn"
                            type="submit"
                        >
                            CREATE
                        </button>
                        <button
                            className="btn-secondary new-board-btn"
                            onClick={() => history.goBack()}
                        >
                            BACK
                        </button>
                    </div>
                </div>
            </form>
            <DeletePostModal
                modalOpen={modalOpen}
                closeModal={closeModal}
                postId={postId}
                thread={thread}
            />
        </div>
    );
};

export default NewReply;

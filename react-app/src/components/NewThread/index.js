import React, {useRef, useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import "./NewThread.css";
import BBCodeBar from "../common/BBCodeBar";
import CustomRadioButton from "../common/CustomRadioButton";
import DeleteThreadModal from "./DeleteThreadModal";

const NewThread = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const {boardId, threadId} = useParams();
    const board = user.boards_joined[boardId];
    const [title, setTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [pinned, setPinned] = useState(false);
    const [locked, setLocked] = useState(false);
    const [errors, setErrors] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const textRef = useRef();

    useEffect(() => {
        (async () => {
            if (threadId) {
                const res = await fetch(`/api/threads/${threadId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.thread.owner_id === user.id) {
                        setTitle(data.thread.title);
                        setPostText(data.posts[0].body);
                        setPinned(data.thread.pinned);
                        setLocked(data.thread.locked);
                    }

                }
            }
        })();
    }, [user, threadId]);

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
            title,
            pinned,
            locked,
            board_id: boardId,
            first_post_body: postText
        };
        let res;
        if(threadId) {
            res = await fetch(`/api/threads/${threadId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        } else {
            res = await fetch("/api/threads", {
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
                history.push(`/board/${boardId}/thread/${data.id}`);
            }
        }
    }

    return (
        <div className="new-thread-container">
            <form
                className="new-thread-form"
                onSubmit={handleSubmit}
            >
                <div className="new-thread-header">NEW THREAD IN {board.name.toUpperCase()}</div>
                <div className="new-thread-form-field">
                    <label
                        className="new-thread-form-label"
                        htmlFor="name"
                    >
                        THREAD TITLE
                    </label>
                    <input
                        className="new-thread-form-input"
                        name="name"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="new-thread-error-div">
                        {errors.name && errors.title.map((error, i) => {
                            return (
                                <div key={i}>{error}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="new-thread-form-field">
                    <label
                        className="new-thread-form-label"
                        htmlFor="description"
                    >
                        POST TEXT
                    </label>
                    <BBCodeBar inputRef={textRef} setter={setPostText}/>
                    <textarea
                        className="new-thread-form-input"
                        name="name"
                        rows={3}
                        value={postText}
                        ref={textRef}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                    <div className="log-reg-error-div">
                        {errors.description && errors.description.map((error, i) => {
                            return (
                                <div key={i}>{error}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="thread-radio-fields">
                    <div className="new-thread-form-field">
                        <label
                            className="new-thread-form-label"
                            htmlFor="description"
                        >
                            PIN THREAD?
                        </label>
                        <div className="radio-button-container">
                            <CustomRadioButton
                                setter={setPinned}
                                currentValue={pinned}
                                targetValue={true}
                                text={"Yes"}
                            />
                            <CustomRadioButton
                                setter={setPinned}
                                currentValue={pinned}
                                targetValue={false}
                                text={"No"}
                            />
                        </div>
                    </div>
                    <div className="new-thread-form-field">
                        <label
                            className="new-thread-form-label"
                            htmlFor="description"
                        >
                            LOCK THREAD?
                        </label>
                        <div className="radio-button-container">
                            <CustomRadioButton
                                setter={setLocked}
                                currentValue={locked}
                                targetValue={true}
                                text={"Yes"}
                            />
                            <CustomRadioButton
                                setter={setLocked}
                                currentValue={locked}
                                targetValue={false}
                                text={"No"}
                            />
                        </div>
                    </div>
                </div>
                <div className="new-board-btn-container">
                    {threadId ?
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
                            onClick={null}
                        >
                            BACK
                        </button>
                    </div>
                </div>
            </form>
            <DeleteThreadModal
                modalOpen={modalOpen}
                closeModal={closeModal}
                thread={{id: threadId, title, board_id: boardId}}
            />
        </div>
    );
};

export default NewThread;

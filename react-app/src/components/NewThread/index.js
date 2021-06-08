import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import "./NewThread.css";
import BBCodeBar from "../common/BBCodeBar";
import CustomRadioButton from "../common/CustomRadioButton";

const NewThread = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const {boardId} = useParams();
    const board = user.boards_joined[boardId];
    const [title, setTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [pinned, setPinned] = useState(false);
    const [locked, setLocked] = useState(false);
    const [errors, setErrors] = useState(false);
    const textRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();
        const body = {
            title,
            pinned,
            locked,
            board_id: boardId,
            first_post_body: postText
        }
        const res = await fetch("/api/threads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            const data = await res.json();
            if (data.errors) {
                setErrors(data.errors);
            } else {
                history.push(`/thread/${data.id}`);
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
                    <button
                        className="btn-primary new-board-btn"
                        type="submit"
                    >
                        CREATE
                    </button>
                    <button
                        className="btn-red new-board-btn"
                        onClick={null}
                    >
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewThread;

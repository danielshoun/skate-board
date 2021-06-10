import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import "./NewBoard.css";
import CustomRadioButton from "../common/CustomRadioButton";
import DeleteBoardModal from "./DeleteBoardModal";
import SmilieEditModal from "./SmilieEditModal";

const NewBoard = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const {boardId} = useParams();
    const [board, setBoard] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [makePrivate, setMakePrivate] = useState(false);
    const [errors, setErrors] = useState({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [smilieModalOpen, setSmilieModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
                if (boardId) {
                    const res = await fetch(`/api/boards/${boardId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.board.owner_id === user.id) {
                            setBoard(data.board);
                            setName(data.board.name);
                            setDescription(data.board.description);
                            setMakePrivate(data.board.private);
                        }
                    }
                }
            }
        )();
    }, [user, boardId]);

    function openDeleteModal(e) {
        e.preventDefault();
        setDeleteModalOpen(true);
    }

    function closeDeleteModal(e) {
        e.stopPropagation();
        setDeleteModalOpen(false);
    }

    function openSmilieModal(e) {
        e.preventDefault();
        setSmilieModalOpen(true);
    }

    function closeSmilieModal(e) {
        e.stopPropagation();
        setSmilieModalOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const body = {
            name,
            description,
            private: makePrivate,
            is_update: board.id
        };
        let res;
        if (board.id) {
            res = await fetch(`/api/boards/${board.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        } else {
            res = await fetch("/api/boards", {
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
                history.push(`/board/${data.id}`);
            }
        } else {
            const data = await res.json();
            if (data.errors) {
                setErrors(data.errors);
            }
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        history.goBack();
    }

    return (
        <div className="new-board-container">
            <form
                className="new-board-form"
                onSubmit={handleSubmit}
            >
                <div
                    className="new-board-header">{board.name ? `EDITING ${board.name.toUpperCase()}` : "NEW BOARD"}</div>
                <div className="new-board-form-field">
                    <label
                        className="new-board-form-label"
                        htmlFor="name"
                    >
                        BOARD NAME
                    </label>
                    <input
                        className="new-board-form-input"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className="new-board-error-div">
                        {errors.name && errors.name.map((error, i) => {
                            return (
                                <div key={i}>{error}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="new-board-form-field">
                    <label
                        className="new-board-form-label"
                        htmlFor="description"
                    >
                        BOARD DESCRIPTION
                    </label>
                    <textarea
                        className="new-board-form-input"
                        name="name"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="log-reg-error-div">
                        {errors.description && errors.description.map((error, i) => {
                            return (
                                <div key={i}>{error}</div>
                            );
                        })}
                    </div>
                </div>
                <div className="new-board-bottom-row">
                    <div className="new-board-form-field">
                        <label
                            className="new-board-form-label"
                            htmlFor="description"
                        >
                            MAKE PRIVATE?
                        </label>
                        <div className="radio-button-container">
                            <CustomRadioButton
                                setter={setMakePrivate}
                                currentValue={makePrivate}
                                targetValue={true}
                                text={"Yes"}
                            />
                            <CustomRadioButton
                                setter={setMakePrivate}
                                currentValue={makePrivate}
                                targetValue={false}
                                text={"No"}
                            />
                        </div>
                    </div>
                    <div>
                        {boardId && <i className="fas fa-smile bb-code-icon" onClick={openSmilieModal}/>}
                    </div>
                </div>
                <div className="new-board-btn-container">
                    {boardId ?
                        <button
                            className="btn-red delete-board-btn"
                            onClick={openDeleteModal}
                        >
                            DELETE
                        </button> : <div/>
                    }
                    <div>
                        <button
                            className="btn-primary new-board-btn"
                            type="submit"
                        >
                            {boardId ? "EDIT" : "CREATE"}
                        </button>
                        <button
                            className="btn-secondary new-board-btn"
                            onClick={handleCancel}
                        >
                            BACK
                        </button>
                    </div>
                </div>
            </form>
            <DeleteBoardModal
                modalOpen={deleteModalOpen}
                closeModal={closeDeleteModal}
                board={board}
            />
            <SmilieEditModal
                modalOpen={smilieModalOpen}
                closeModal={closeSmilieModal}
                boardId={board.id}
            />
        </div>
    );
};

export default NewBoard;

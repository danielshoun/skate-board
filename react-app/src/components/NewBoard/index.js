import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import "./NewBoard.css";
import CustomRadioButton from "../common/CustomRadioButton";
import DeleteBoardModal from "./DeleteBoardModal";

const NewBoard = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const {boardId} = useParams();
    const [board, setBoard] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [makePrivate, setMakePrivate] = useState(false);
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

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
            name,
            description,
            private: makePrivate
        };
        const res = await fetch("/api/boards", {
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
                history.push(`/board/${data.id}`);
            }
        }
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
                <div className="new-board-btn-container">
                    {board.name ?
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
                            className="btn-red new-board-btn"
                            onClick={null}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </form>
            <DeleteBoardModal
                modalOpen={modalOpen}
                closeModal={closeModal}
                board={board}
            />
        </div>
    );
};

export default NewBoard;

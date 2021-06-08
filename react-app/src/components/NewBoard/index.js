import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import "./NewBoard.css";
import CustomRadioButton from "../common/CustomRadioButton";

const NewBoard = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [makePrivate, setMakePrivate] = useState(false);
    const [errors, setErrors] = useState({});

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
                <div className="new-board-header">NEW BOARD</div>
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

export default NewBoard;

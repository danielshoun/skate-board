import React, {useState} from "react";

const EditSmilieForm = ({smilie, goBack}) => {
    const [smilieNameInput, setSmilieNameInput] = useState(smilie.name.slice(1, smilie.name.length - 1));
    const [errors, setErrors] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const body = {
            name: smilieNameInput,
            board_id: smilie.board_id,
            is_update: smilie.id
        };

        const res = await fetch(`/api/smilies/${smilie.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            goBack();
        } else {
            const data = await res.json();
            setErrors(data.errors);
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        goBack();
    }

    async function handleDelete(e) {
        e.preventDefault();
        if (deleteConfirm) {
            const res = await fetch(`/api/smilies/${smilie.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                goBack();
            }
        } else {
            setDeleteConfirm(true);
        }

    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="new-board-form-field">
                <label
                    className="new-board-form-label"
                    htmlFor="name"
                >
                    SMILIE NAME
                </label>
                <input
                    className="new-board-form-input"
                    name="name"
                    type="text"
                    value={smilieNameInput}
                    onChange={(e) => setSmilieNameInput(e.target.value)}
                />
                <div className="new-board-error-div">
                    {errors.name && errors.name.map((error, i) => {
                        return (
                            <div key={i}>{error}</div>
                        );
                    })}
                </div>
            </div>
            <div className="smilie-image-container">
                {smilie.url && <img className="new-smilie-img" src={smilie.url} alt={smilieNameInput}/>}
            </div>
            <div className="add-smilie-btn-container" style={{marginTop: "8px"}}>
                <button
                    className="btn-primary add-smilie-btn"
                    type="submit"
                >
                    EDIT
                </button>
                <button
                    className="btn-secondary add-smilie-btn"
                    onClick={handleCancel}
                >
                    BACK
                </button>
                <button
                    className="btn-red add-smilie-btn"
                    onClick={handleDelete}
                >
                    DELETE
                </button>
            </div>
            {deleteConfirm && <div className="new-board-error-div delete-confirm-div">
                WARNING: This action cannot be undone! Click the delete button again to confirm.
            </div>}
        </form>
    );
};

export default EditSmilieForm;

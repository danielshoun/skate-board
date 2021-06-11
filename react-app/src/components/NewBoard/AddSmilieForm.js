import React, {useEffect, useRef, useState} from "react";

const AddSmilieForm = ({goBack, boardId}) => {
    const [smilieNameInput, setSmilieNameInput] = useState("");
    const [smilieImageURL, setSmilieImageURL] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [smilieImageInput, setSmilieImageInput] = useState("");
    const fileInputRef = useRef();

    useEffect(() => {
        if (smilieImageInput) {
            const url = URL.createObjectURL(smilieImageInput);
            setSmilieImageURL(url);
        }
    }, [smilieImageInput]);

    function updateImage(e) {
        e.preventDefault();
        setSmilieImageInput(e.target.files[0]);
    }

    function customFileBtn(e) {
        e.preventDefault();
        fileInputRef.current.click();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", smilieImageInput);
        formData.append("name", smilieNameInput);
        formData.append("board_id", boardId)
        setImageLoading(true);

        const res = await fetch("/api/smilies", {
            method: "POST",
            body: formData
        });
        if(res.ok) {
            await res.json();
            setImageLoading(false);
            goBack();
        } else {
            setImageLoading(false);
            const data = await res.json();
            if(data.errors) {
                setErrors(data.errors)
            }
            console.log("error");
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        goBack();
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
            <div className="new-board-form-field">
                <label
                    className="new-board-form-label"
                    htmlFor="file"
                >
                    SMILIE IMAGE
                </label>
                <input
                    className="btn-secondary"
                    name="name"
                    type="file"
                    ref={fileInputRef}
                    onChange={updateImage}
                    hidden={true}
                />
                <button className="btn-secondary file-browse-btn" onClick={customFileBtn}>BROWSE</button>
                <div className="new-board-error-div">
                    {errors.image && errors.image.map((error, i) => {
                        return (
                            <div key={i}>{error}</div>
                        );
                    })}
                </div>
                <div className="smilie-image-container">
                    {smilieImageURL && <img className="new-smilie-img" src={smilieImageURL} alt={smilieNameInput}/>}
                </div>
            </div>
            <div className="add-smilie-btn-container">
                <button
                    className="btn-primary add-smilie-btn"
                    type="submit"
                >
                    ADD
                </button>
                <button
                    className="btn-secondary add-smilie-btn"
                    onClick={handleCancel}
                    disabled={imageLoading}
                >
                    BACK
                </button>
            </div>
        </form>
    );
};

export default AddSmilieForm;

import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import "./SmilieEditModal.css";

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#1a1a1b",
        border: "none",
        padding: "0"
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    }
};

const SmilieModal = ({modalOpen, closeModal, boardId}) => {
    const [defaultSmilies, setDefaultSmilies] = useState([]);
    const [customSmilies, setCustomSmilies] = useState([]);
    const [showingAddForm, setShowingAddForm] = useState(false);
    const [showingEditForm, setShowingEditForm] = useState(false);
    const [smilieNameInput, setSmilieNameInput] = useState("");
    const [smilieImageInput, setSmilieImageInput] = useState("");
    const [smilieImageURL, setSmilieImageURL] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const fileInputRef = useRef();
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (modalOpen && !showingAddForm && !showingEditForm) {
            (async () => {
                const res = await fetch(`/api/smilies/${boardId}`);
                if (res.ok) {
                    const data = await res.json();
                    setDefaultSmilies(data.filter(smilie => smilie.board_id === null));
                    setCustomSmilies(data.filter(smilie => smilie.board_id === boardId));
                }
            })();
        }
    }, [modalOpen, boardId, showingAddForm, showingEditForm]);

    useEffect(() => {
        if (modalOpen) {
            setShowingEditForm(false);
            setShowingAddForm(false);
        }
    }, [modalOpen]);

    useEffect(() => {
        if (smilieImageInput) {
            const url = URL.createObjectURL(smilieImageInput);
            setSmilieImageURL(url);
        }
    }, [smilieImageInput]);

    function handleFormSwitch(e, type) {
        e.preventDefault();
        if (type === "add") {
            setShowingAddForm(true);
            setShowingEditForm(false);
        }
    }

    function updateImage(e) {
        e.preventDefault();
        setSmilieImageInput(e.target.files[0]);
    }

    function customFileBtn(e) {
        e.preventDefault();
        fileInputRef.current.click();
    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            closeTimeoutMS={120}
            appElement={document.getElementById("root")}
        >
            <div className="smilie-modal-container">
                {showingAddForm &&
                <>
                    <form>
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
                                {errors.name && errors.name.map((error, i) => {
                                    return (
                                        <div key={i}>{error}</div>
                                    );
                                })}
                            </div>
                            <div className="smilie-image-container">
                                {smilieImageURL && <img className="new-smilie-img" src={smilieImageURL} alt={smilieNameInput}/>}
                            </div>
                        </div>
                    </form>
                </>
                }
                {!showingAddForm && !showingEditForm &&
                <>
                    <div className="smilie-modal-header">DEFAULT</div>
                    <div className="smilie-card-container first-smilie-container">
                        {defaultSmilies.map(smilie => {
                            return (
                                <div key={smilie.id} className="smilie-card edit-default-smilie"
                                     onClick={(e) => null}>
                                    <img src={smilie.url} alt={smilie.name} className="smilie-image"/>
                                    <div className="smilie-name">{smilie.name}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="smilie-modal-header edit-header-container">
                        <div>CUSTOM</div>
                        <button className="btn-primary" onClick={(e) => handleFormSwitch(e, "add")}>ADD</button>
                    </div>
                    <div className="smilie-card-container">
                        {customSmilies.length === 0 &&
                        <div className="no-results-info">
                            This board doesn't have any custom smilies. :(
                        </div>
                        }
                        {customSmilies.map(smilie => {
                            return (
                                <div key={smilie.id} className="smilie-card" onClick={(e) => null}>
                                    <img src={smilie.url} alt={smilie.name} className="smilie-image"/>
                                    <div className="smilie-name">{smilie.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </>
                }
            </div>
        </Modal>
    );
};

export default SmilieModal;

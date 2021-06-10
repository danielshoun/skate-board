import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import "./SmilieEditModal.css";
import AddSmilieForm from "./AddSmilieForm";

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



    function handleFormSwitch(e, type) {
        e.preventDefault();
        if (type === "add") {
            setShowingAddForm(true);
            setShowingEditForm(false);
        }
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
                {showingAddForm && <AddSmilieForm goBack={() => setShowingAddForm(false)} boardId={boardId}/>}
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

import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import "./SmilieModal.css";

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

const SmilieModal = ({modalOpen, closeModal, boardId, input, setter}) => {
    const [defaultSmilies, setDefaultSmilies] = useState([]);
    const [customSmilies, setCustomSmilies] = useState([]);

    function addSmilie(e, smilieName) {
        const startSelect = input.selectionStart;
        const endSelect = input.selectionEnd;
        const textBeforeSelect = input.value.substring(0, startSelect);
        const textAfterSelect = input.value.substring(endSelect, input.value.length);
        setter(input.value = textBeforeSelect + smilieName + textAfterSelect);
        input.focus();
        input.selectionStart = startSelect + smilieName.length;
        input.selectionEnd = endSelect - startSelect === 0 ? endSelect + smilieName.length : endSelect + smilieName.length - 1;
        closeModal(e);
    }

    useEffect(() => {
        if (modalOpen) {
            (async () => {
                const res = await fetch(`/api/smilies/${boardId}`);
                if (res.ok) {
                    const data = await res.json();
                    setDefaultSmilies(data.filter(smilie => smilie.board_id === null));
                    setCustomSmilies(data.filter(smilie => smilie.board_id === Number(boardId)));
                }
            })();
        }
    }, [modalOpen, boardId]);
    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            closeTimeoutMS={120}
            appElement={document.getElementById("root")}
        >
            <div className="smilie-modal-container">
                <div className="smilie-modal-header">DEFAULT</div>
                <div className="smilie-card-container first-smilie-container">
                    {defaultSmilies.map(smilie => {
                        return (
                            <div key={smilie.id} className="smilie-card" onClick={(e) => addSmilie(e, smilie.name)}>
                                <img src={smilie.url} alt={smilie.name} className="smilie-image"/>
                                <div className="smilie-name">{smilie.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="smilie-modal-header">CUSTOM</div>
                <div className="smilie-card-container">
                    {customSmilies.length === 0 &&
                    <div className="no-results-info">
                        This board doesn't have any custom smilies. :(
                    </div>
                    }
                    {customSmilies.map(smilie => {
                        return (
                            <div key={smilie.id} className="smilie-card" onClick={(e) => addSmilie(e, smilie.name)}>
                                <img src={smilie.url} alt={smilie.name} className="smilie-image"/>
                                <div className="smilie-name">{smilie.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </Modal>
    );
};

export default SmilieModal;

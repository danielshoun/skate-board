import React from "react";
import Modal from "react-modal";
import "./DeleteBoardModal.css";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {authenticate} from "../../store/session";

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

const DeleteBoardModal = ({modalOpen, closeModal, board}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    async function handleDelete() {
        const res = await fetch (`/api/boards/${board.id}`, {
            method: "DELETE"
        })
        if(res.ok) {
            history.push("/");
            await dispatch(authenticate());
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
            <div className="delete-modal-container">
                <div className="delete-modal-info">
                    Are you sure you want to delete {board.name}?
                </div>
                <div className="delete-modal-warning">
                    WARNING: This action cannot be undone!
                </div>
                <div className="delete-modal-button-container">
                    <button
                        className="btn-red"
                        onClick={handleDelete}
                    >
                        DELETE
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={closeModal}
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteBoardModal;

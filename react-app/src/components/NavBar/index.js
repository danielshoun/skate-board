import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Modal from "react-modal";
import "./NavBar.css";
import LogRegModal from "./LogRegModal";

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#36393f",
        border: "none",
        padding: "0"
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    }
};

const NavBar = () => {
    const user = useSelector(state => state.session.user);
    const [activeCommunity, setActiveCommunity] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState();

    useEffect(() => {
        if(!modalType) {
            setModalOpen(false);
        } else {
            setModalOpen(true);
        }
    }, [modalType])

    function openModal(type) {
        setModalType(type)
    }

    function closeModal(e) {
        e.stopPropagation();
        setModalType(null);
    }

    return (
        <>
            <nav className="nav-container">
                <div className="nav-logo-area">
                    <span className="nav-logo-text">Skate Board</span>
                </div>
                <div className="nav-dropdown-area">
                    <div
                        className="dropdown-container"
                        onClick={() => setDropdownOpen(prevState => !prevState)}
                    >
                        <span
                            className={`dropdown-active-text${activeCommunity === "" && " no-active"}`}>
                            {activeCommunity === "" ? "Go to board..." : activeCommunity}
                        </span>
                        <i className={`fas fa-chevron-down dropdown-chevron${dropdownOpen ? " active-chevron" : ""}`}/>
                    </div>
                </div>
                <div className="nav-user-area">
                    {user ?
                        <i className="fas fa-user-circle"/> :
                        <>
                            <button
                                className="btn-primary btn-nav-login"
                                onClick={() => openModal("login")}
                            >
                                LOG IN
                            </button>
                            <button
                                className="btn-primary btn-nav-login"
                                onClick={() => openModal("register")}
                            >
                                REGISTER
                            </button>
                        </>
                    }
                </div>
            </nav>
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={modalStyles}
                closeTimeoutMS={120}
            >
                <LogRegModal
                    initialType={modalType}
                    closeModal={closeModal}
                />
            </Modal>
        </>
    );
};

export default NavBar;

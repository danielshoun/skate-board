import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "./NavBar.css";
import logo from "./logo.png";
import {logout} from "../../store/session";
import LogRegModal from "./LogRegModal";
import NavDropdown from "./NavDropdown";

const NavBar = () => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        if (!modalType) {
            setModalOpen(false);
        } else {
            setModalOpen(true);
        }
    }, [modalType]);

    function openModal(type) {
        setModalType(type);
    }

    function closeModal(e) {
        e.stopPropagation();
        setModalType(null);
    }

    // function handleSettings(e) {
    //     e.stopPropagation();
    //     history.push("/settings");
    //     setUserMenuOpen(false);
    // }
    //
    // function handleMyBoards(e) {
    //     e.stopPropagation();
    //     history.push("/boards/manage");
    //     setUserMenuOpen(false);
    // }

    async function handleLogout(e) {
        e.stopPropagation();
        await dispatch(logout());
        setUserMenuOpen(false);
    }

    return (
        <>
            <nav className="nav-container">
                <div
                    className="nav-logo-area"
                    onClick={() => history.push("/")}
                >
                    <img src={logo} alt="Skate Board" className="nav-logo-image"/>
                    <span className="nav-logo-text">Skate Board</span>
                </div>
                <div className="nav-dropdown-area">
                    <NavDropdown/>
                </div>
                <div className="nav-user-area"
                     onMouseEnter={() => user ? setUserMenuOpen(true) : null}
                     onMouseLeave={() => user ? setUserMenuOpen(false) : null}
                >
                    {user ?
                        <i className="fas fa-user-circle btn-nav-user"/> :
                        <>
                            <button
                                className="btn-primary btn-nav-login"
                                onClick={() => openModal("login")}
                            >
                                LOG IN
                            </button>
                            <button
                                className="btn-secondary btn-nav-login"
                                onClick={() => openModal("register")}
                            >
                                REGISTER
                            </button>
                        </>
                    }
                    {userMenuOpen &&
                    <div className="nav-user-menu">
                        {/*<div*/}
                        {/*    className="nav-user-menu-item"*/}
                        {/*    onClick={handleSettings}*/}
                        {/*>*/}
                        {/*    <i className="fas fa-cog btn-user-menu"/>*/}
                        {/*    <span className="user-menu-text">SETTINGS</span>*/}
                        {/*</div>*/}
                        {/*<div*/}
                        {/*    className="nav-user-menu-item"*/}
                        {/*    onClick={handleMyBoards}*/}
                        {/*>*/}
                        {/*    <i className="fas fa-clipboard-list btn-user-menu"/>*/}
                        {/*    <span className="user-menu-text">MY BOARDS</span>*/}
                        {/*</div>*/}
                        <div
                            className="nav-user-menu-item"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt btn-user-menu"/>
                            <span className="user-menu-text">LOG OUT</span>
                        </div>
                    </div>
                    }
                </div>
            </nav>
            <LogRegModal
                initialType={modalType}
                modalOpen={modalOpen}
                closeModal={closeModal}
            />
        </>
    );
};

export default NavBar;

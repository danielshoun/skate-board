import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "./NavDropdown.css";

const NavDropdown = () => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownBoards, setDropdownBoards] = useState([]);
    const [dropdownInput, setDropdownInput] = useState("");

    useEffect(() => {
        function handleOutsideClick(e) {
            if (e.target.className !== "dropdown-menu-item" || e.target.className !== "dropdown-input") {
                setDropdownOpen(false);
            }
        }

        if (dropdownOpen === true) {
            if (user) {
                (async () => {
                    const res = await fetch("/api/boards/joined");
                    if (res.ok) {
                        const data = await res.json();
                        setDropdownBoards(data);
                    }
                })();
            }
            document.addEventListener("click", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [user, dropdownOpen]);

    function handleMenuItemClick(e, id) {
        e.stopPropagation();
        console.log(id);
        if (id === "directory") {
            history.push("/directory");
        } else if (id === "create") {
            history.push("/board/new");
        } else {
            history.push(`/board/${id}`);
        }
        setDropdownOpen(false);
    }

    return (
        <div
            className="dropdown-container"
            onClick={() => setDropdownOpen(prevState => !prevState)}
        >
                        <span className={"dropdown-active-text"}>
                            Go to board...
                        </span>
            <i className={`fas fa-chevron-down dropdown-chevron${dropdownOpen ? " active-chevron" : ""}`}/>
            {dropdownOpen &&
            <div className="dropdown-menu">
                <div className="dropdown-search-container">
                    <input
                        className="dropdown-input"
                        type="text"
                        placeholder={user ? "Filter..." : "Search..."}
                        value={dropdownInput}
                        onChange={(e) => setDropdownInput(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                {user &&
                <div className="dropdown-header">YOUR BOARDS</div>
                }
                {dropdownBoards.map(board => {
                    return (
                        <div
                            key={board.id}
                            className="dropdown-menu-item"
                            onClick={(e) => handleMenuItemClick(e, board.id)}
                        >
                            {board.name}
                        </div>
                    );
                })}
                <div className="dropdown-header">OTHER</div>
                <div
                    className="dropdown-menu-item"
                    onClick={(e) => handleMenuItemClick(e, "directory")}
                >
                    Directory
                </div>
                {user &&
                <div
                    className="dropdown-menu-item"
                    onClick={(e) => handleMenuItemClick(e, "create")}
                >
                    Create New Board
                </div>
                }
            </div>
            }
        </div>
    );
};

export default NavDropdown;

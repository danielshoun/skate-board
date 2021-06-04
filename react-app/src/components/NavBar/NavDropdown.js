import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import "./NavDropdown.css";

const NavDropdown = () => {
        const user = useSelector(state => state.session.user);
        const history = useHistory();
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [filteredBoards, setFilteredBoards] = useState([]);
        const [dropdownInput, setDropdownInput] = useState("");

        useEffect(() => {
            function handleOutsideClick(e) {
                if (e.target.className !== "dropdown-menu-item" || e.target.className !== "dropdown-input") {
                    setDropdownOpen(false);
                }
            }

            if (dropdownOpen === true) {
                document.addEventListener("click", handleOutsideClick);
            } else {
                setDropdownInput("");
            }
            return () => {
                document.removeEventListener("click", handleOutsideClick);
            };
        }, [user, dropdownOpen]);

        useEffect(() => {
            if (user) {
                if (dropdownInput.length > 0) {
                    setFilteredBoards(
                        Object.keys(user.boards_joined)
                            .filter(
                                board_id => user.boards_joined[board_id].name.toLowerCase().includes(dropdownInput.toLowerCase())
                            ).map(board_id => user.boards_joined[board_id])
                    );
                } else {
                    setFilteredBoards([]);
                }
            }
        }, [user, dropdownInput]);

        function handleInputEnter(e) {
            if (e.key === "Enter") {
                history.push(`/directory?search=${dropdownInput}`);
                setDropdownOpen(false);
            }
        }

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
                            onKeyDown={handleInputEnter}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {user &&
                    <div className="dropdown-header">YOUR BOARDS</div>
                    }
                    {filteredBoards.length > 0 && filteredBoards.map(board => {
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
                    {dropdownInput.length === 0 && Object.keys(user.boards_joined).map(board_id => {
                        return (
                            <div
                                key={board_id}
                                className="dropdown-menu-item"
                                onClick={(e) => handleMenuItemClick(e, board_id)}
                            >
                                {user.boards_joined[board_id].name}
                            </div>
                        );
                    })}
                    {(filteredBoards.length === 0 && dropdownInput.length > 0 && user) &&
                    <div className="not-found-item">
                    <span>No boards found.{" "}
                        <Link className="dropdown-search-link" to={`/directory?search=${dropdownInput}`}>
                            Click here
                        </Link>
                        {" "}or press enter to search the directory instead.
                    </span>
                    </div>
                    }
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
    }
;

export default NavDropdown;

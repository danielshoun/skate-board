import React, {useState} from "react";
import "./NavBar.css";
import {NavLink} from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";

const NavBar = ({setAuthenticated}) => {
    const [activeCommunity, setActiveCommunity] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
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
                
            </div>
            {/*<ul className="nav-ul">*/}
            {/*    <li>*/}
            {/*        <NavLink to="/" exact={true} activeClassName="active">*/}
            {/*            Home*/}
            {/*        </NavLink>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <NavLink to="/login" exact={true} activeClassName="active">*/}
            {/*            Login*/}
            {/*        </NavLink>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <NavLink to="/sign-up" exact={true} activeClassName="active">*/}
            {/*            Sign Up*/}
            {/*        </NavLink>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <NavLink to="/users" exact={true} activeClassName="active">*/}
            {/*            Users*/}
            {/*        </NavLink>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <LogoutButton setAuthenticated={setAuthenticated}/>*/}
            {/*    </li>*/}
            {/*</ul>*/}
        </nav>
    );
};

export default NavBar;

import React, {useState, useEffect} from "react";
import "./LogRegModal.css";
import {useDispatch} from "react-redux";
import Modal from "react-modal";
import {login, signUp} from "../../store/session";

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#272729",
        border: "none",
        padding: "0"
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    }
};

const LogRegModal = ({initialType, modalOpen, closeModal}) => {
    const dispatch = useDispatch();
    const [type, setType] = useState(initialType);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setType(initialType)
    }, [initialType])

    async function handleSubmit(e) {
        e.preventDefault();
        let data;
        if (type === "login") {
            data = await dispatch(login(email, password));
        } else {
            if (password !== confirmPassword) {
                setErrors({confirmPassword: ["Passwords do not match"]});
                return;
            }
            data = await dispatch(signUp(username, email, password));
        }
        if (data.errors) {
            setErrors(data.errors);
        } else {
            closeModal(e);
        }
    }

    async function handleDemo(e) {
        e.preventDefault();
        const data = await dispatch(login("demo@aa.io", "password"));
        if (data.errors) {
            setErrors(data.errors);
        } else {
            closeModal(e);
        }
    }

    function handleTypeSwitch() {
        setUsername("");
        setPassword("");
        setEmail("");
        setConfirmPassword("");
        setErrors({});
        setType(prevState => prevState === "login" ? "register" : "login");
    }

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            closeTimeoutMS={120}
            appElement={document.getElementById("root")}
        >
            <div className="log-reg-modal-container">
                <form
                    className="log-reg-form"
                    onSubmit={handleSubmit}
                >
                    <div className="log-reg-form-field">
                        <label
                            className="log-reg-form-label"
                            htmlFor="email"
                        >
                            EMAIL
                        </label>
                        <input
                            className="log-reg-form-input"
                            name="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="log-reg-error-div">
                            {errors.email && errors.email.map((error, i) => {
                                return (
                                    <div key={i}>{error}</div>
                                );
                            })}
                        </div>
                    </div>
                    {type === "register" &&
                    <div className="log-reg-form-field">
                        <label
                            className="log-reg-form-label"
                            htmlFor="username"
                        >
                            USERNAME
                        </label>
                        <input
                            className="log-reg-form-input"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="log-reg-error-div">
                            {errors.username && errors.username.map((error, i) => {
                                return (
                                    <div key={i}>{error}</div>
                                );
                            })}
                        </div>
                    </div>
                    }
                    <div className="log-reg-form-field">
                        <label
                            className="log-reg-form-label"
                            htmlFor="password"
                        >
                            PASSWORD
                        </label>
                        <input
                            className="log-reg-form-input"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="log-reg-error-div">
                            {errors.password && errors.password.map((error, i) => {
                                return (
                                    <div key={i}>{error}</div>
                                );
                            })}
                        </div>
                    </div>
                    {type === "register" &&
                    <div className="log-reg-form-field">
                        <label
                            className="log-reg-form-label"
                            htmlFor="confirmPassword"
                        >
                            CONFIRM PASSWORD
                        </label>
                        <input
                            className="log-reg-form-input"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="log-reg-error-div">
                            {errors.confirmPassword && errors.confirmPassword.map((error, i) => {
                                return (
                                    <div key={i}>{error}</div>
                                );
                            })}
                        </div>
                    </div>
                    }
                    <div className="log-reg-btn-container">
                        <button
                            className="btn-primary log-reg-btn"
                            type="submit"
                        >
                            {type === "login" ? "LOG IN" : "REGISTER"}
                        </button>
                        <button
                            className="btn-secondary log-reg-btn"
                            onClick={handleDemo}
                        >
                            DEMO
                        </button>
                        <button
                            className="btn-red log-reg-btn"
                            onClick={closeModal}
                        >
                            CANCEL
                        </button>
                    </div>
                    <div
                        className="switch-type-container"
                        onClick={handleTypeSwitch}
                    >
                        {type === "login" ? "Don't have an account? Go to register..." : "Already have an account? Go to login..."}
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default LogRegModal;

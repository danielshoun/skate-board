import React, {useState} from "react";

const LogRegModal = ({initialType, closeModal}) => {
    const [type, setType] = useState(initialType);

    return (
        <div className="log-reg-modal-container">
            {type}
        </div>
    );
};

export default LogRegModal;

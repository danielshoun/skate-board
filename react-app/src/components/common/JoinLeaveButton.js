import React from "react";
import {useDispatch} from "react-redux";
import {authenticate} from "../../store/session";
import "./JoinLeaveButton.css";

const JoinLeaveButton = ({userIsMember, board, setBoard, setBoards}) => {
    const dispatch = useDispatch();

    async function handleSetBoards(res) {
        const data = await res.json();
        await dispatch(authenticate());
        setBoards(prevState => {
            const updateIndex = prevState.findIndex(findBoard => findBoard.id === board.id);
            return [...prevState.slice(0, updateIndex), data, ...prevState.slice(updateIndex + 1, prevState.length)];
        });
    }

    async function handleSetBoard(res) {
        const data = await res.json();
        await dispatch(authenticate());
        setBoard(data);
    }

    async function handleJoin(e) {
        e.stopPropagation();
        const res = await fetch(`/api/boards/${board.id}/join`, {
            method: "POST"
        });
        if (res.ok) {
            if (setBoards) await handleSetBoards(res);
            else await handleSetBoard(res);
        }
    }

    async function handleLeave(e) {
        e.stopPropagation();
        const res = await fetch(`/api/boards/${board.id}/leave`, {
            method: "POST"
        });
        if (res.ok) {
            if (setBoards) await handleSetBoards(res);
            else await handleSetBoard(res);
        }
    }

    return (
        <button
            className={`${userIsMember ? "btn-red" : "btn-primary"} join-button`}
            onClick={(e) => userIsMember ? handleLeave(e) : handleJoin(e)}
        >
            {userIsMember ? "LEAVE" : "JOIN"}
        </button>
    );
};

export default JoinLeaveButton;

import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import "./Board.css";
import JoinLeaveButton from "../common/JoinLeaveButton";

const Board = () => {
    const user = useSelector(state => state.session.user);
    const {boardId} = useParams();
    const [board, setBoard] = useState({});
    const [userIsMember, setUserIsMember] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/boards/${boardId}`);
            if (res.ok) {
                const data = await res.json();
                setBoard(data);
            }
        })();
    }, [boardId]);

    useEffect(() => {
        setUserIsMember(user && board.id in user.boards_joined);
    }, [user, board]);

    return (
        <div className="board-container">
            <div className="board-info-container">
                <div className="board-about-info">
                    <div className="board-info-name">
                        {board.name}
                    </div>
                    <div className="board-info-description">
                        {board.description}
                    </div>
                </div>
                <div className="board-controls">
                    <div className="board-users">
                        {board.member_count} USER{board.member_count > 1 ? "S" : ""}
                    </div>
                    {user &&
                    <JoinLeaveButton
                        userIsMember={userIsMember}
                        board={board}
                        setBoard={setBoard}
                    />
                    }
                    {user && board.owner_id === user.id &&
                    <button className="btn-secondary board-edit-btn">EDIT</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Board;

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const Board = () => {
    const {boardId} = useParams();
    const [board, setBoard] = useState({});

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/boards/${boardId}`)
            if(res.ok) {
                const data = await res.json();
                setBoard(data);
            }
        })();
    }, [boardId])

    return (
        <div className="board-container">
            {board.name}
        </div>
    );
};

export default Board;

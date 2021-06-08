import React from "react";
import {Link} from "react-router-dom";

const ThreadPageLinks = ({thread}) => {
    const threadPageCount = Math.ceil(thread.post_count / 40);

    return (
        <div className="thread-item-page-links">
            Pages:{
            threadPageCount < 10 ?
                Array.from({length: threadPageCount}, (x, i) => i + 1)
                    .map(num => {
                        return (
                            <Link
                                key={num}
                                className="thread-page-link"
                                to={`/board/${thread.board_id}/thread/${thread.id}?page=${num}`}
                            >
                                {num}
                            </Link>
                        );
                    }) :
                <>
                    {
                        Array.from({length: 3}, (x, i) => i + 1)
                            .map(num => {
                                return (
                                    <Link
                                        key={num}
                                        className="thread-page-link"
                                        to={`/board/${thread.board_id}/thread/${thread.id}?page=${num}`}
                                    >
                                        {num}
                                    </Link>
                                );
                            })
                    }
                    <span className="page-link-separator">...</span>
                    {
                        Array.from({length: 3}, (x, i) => i + (threadPageCount - 2))
                            .map(num => {
                                return (
                                    <Link
                                        key={num}
                                        className="thread-page-link"
                                        to={`/board/${thread.board_id}/thread/${thread.id}?page=${num}`}
                                    >
                                        {num}
                                    </Link>
                                );
                            })
                    }
                </>
        }
        </div>
    )
}

export default ThreadPageLinks;

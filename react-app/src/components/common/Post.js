import React from "react";
import parser from "bbcode-to-react";
import "./Post.css";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import getDateString from "../../utils/getDateString";

const Post = ({post, thread, board}) => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    function getRegDate(isoDate) {
        const dateObj = new Date(isoDate + "Z");
        let month = dateObj.toLocaleString("en-us", {month: "short"});
        return `${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    return (
        <div className="post-container">
            <div className="post-info">
                <div className="post-owner-info">
                    <div className="post-owner-name">{post.owner.username}</div>
                    <div className="post-owner-reg-date">{getRegDate(post.owner.reg_date)}</div>
                    {post.owner.avatar_url &&
                    <img className="post-owner-avatar" src={post.owner.avatar_url} alt={post.owner.username}/>
                    }
                    <div className="post-owner-title">
                        {parser.toReact(post.owner.title || "")}
                    </div>
                </div>
                <div className="post-date">
                    at {getDateString(post.created_at)}
                </div>
            </div>
            <div className="post-body">
                {parser.toReact(post.body)}
                {post.owner_id === user.id &&
                <div className="post-button-container">
                    <button
                        className="btn-secondary new-reply-btn"
                        onClick={() => history.push(`/board/${board.id}/thread/${thread.id}/post/${post.id}/edit`)}
                    >
                        EDIT
                    </button>
                </div>
                }
            </div>
        </div>
    );
};

export default Post;

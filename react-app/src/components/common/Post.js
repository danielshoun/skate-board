import React from "react";
import parser from "bbcode-to-react";
import "./Post.css";
import getDateString from "../../utils/getDateString";

const Post = ({post}) => {
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
                        {parser.toReact(post.owner.title)}
                    </div>
                </div>
                <div className="post-date">
                    at {getDateString(post.created_at)}
                </div>
            </div>
            <div className="post-body">
                {parser.toReact(post.body)}
            </div>
        </div>
    );
};

export default Post;

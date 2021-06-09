import React from "react";
import parser from "bbcode-to-react";
import "./Post.css";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import getDateString from "../../utils/getDateString";
import reactStringReplace from "react-string-replace";

const Post = ({post, thread, board, isFirstPost, smilies}) => {
    const user = useSelector(state => state.session.user);
    const history = useHistory();

    function getRegDate(isoDate) {
        const dateObj = new Date(isoDate + "Z");
        let month = dateObj.toLocaleString("en-us", {month: "short"});
        return `${month} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    }

    function replaceSmilies(input) {
        // Input: An array where elements are either strings or React components.
        let output = []
        input.forEach(el => {
            console.log(el)
            if(typeof el === "string") {
                let temp = el;
                smilies.forEach(smilie => {
                    temp = reactStringReplace(temp, smilie.name, (match, i) => {
                        return <img key={`${smilie.name}_${i}`} src={smilie.url} alt={smilie.name}/>
                    })
                })
                output.push(temp);
            } else {
                el.props.children.forEach((child, i) => {
                    let temp = child;
                    smilies.forEach(smilie => {
                        temp = reactStringReplace(temp, smilie.name, (match, i) => {
                            return <img key={`${smilie.name}_${i}`} src={smilie.url} alt={smilie.name}/>
                        })
                    })
                    el.props.children[i] = temp;
                })
                output.push(el);
            }
        })
        return output;
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
                        {replaceSmilies(parser.toReact(post.owner.title || ""))}
                    </div>
                </div>
                <div className="post-date">
                    at {getDateString(post.created_at)}
                </div>
            </div>
            <div className="post-body">
                <div>{replaceSmilies(parser.toReact(post.body))}</div>
                {post.owner_id === user.id && !isFirstPost &&
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

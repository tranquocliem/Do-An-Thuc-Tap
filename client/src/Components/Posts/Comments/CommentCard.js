import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import moment from "moment";
import "moment/locale/vi";
import CommentMenu from "./CommentMenu";
import { updateComment } from "../../../Service/CommentService";
import {
  dropHeartComment,
  getHeartComment,
  unHeartComment,
} from "../../../Service/HeartCommentService";
import InputComment from "./InputComment";
import { updateReplyComment } from "../../../Service/ReplyCommentService";

function CommentCard({
  children,
  post,
  comment,
  commentId,
  user,
  reloadReplyComment,
  reloadComment,
}) {
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const [isLike, SetIsLike] = useState(false);
  const [totalHeartComment, setTotalHeartComment] = useState(0);
  const [heartComments, setHeartComments] = useState([]);

  const [onReply, setOnReply] = useState(false);
  const [reply, setReply] = useState();

  const fGetHeartComment = async (id) => {
    if (!id) return;
    const data = await getHeartComment(id);
    if (data.success) {
      setTotalHeartComment(data.total);
      setHeartComments(data.hearts);
    }
  };

  useEffect(() => {
    setContent(comment.content);
  }, [comment]);

  useEffect(() => {
    fGetHeartComment(comment._id);
  }, [comment._id]);

  useEffect(() => {
    heartComments.map((h) => h.userId === user._id && SetIsLike(true));
  }, [heartComments, user._id]);

  const fDropHeartComment = async () => {
    try {
      const variable = {
        commentId: comment._id,
        replyHeart: commentId,
        postId: post._id,
      };
      await dropHeartComment(variable);
      SetIsLike(true);
      setTotalHeartComment(totalHeartComment + 1);
    } catch (error) {
      SetIsLike(true);
      setTotalHeartComment(totalHeartComment + 1);
    }
  };

  const fUnHeartComment = async () => {
    try {
      await unHeartComment(comment._id);
      SetIsLike(false);
      setTotalHeartComment(totalHeartComment - 1);
    } catch (error) {
      SetIsLike(false);
      setTotalHeartComment(totalHeartComment - 1);
    }
  };

  const dropAndUnHeart = () => {
    if (isLike) {
      fUnHeartComment();
    } else {
      fDropHeartComment();
    }
  };

  const onUpdateComment = async () => {
    if (comment.content !== content) {
      if (user._id !== comment.writer._id) {
        setContent(comment.content);
        setOnEdit(false);
        return;
      }

      if (comment.reply) {
        await updateReplyComment(comment._id, { content });
        setOnEdit(false);
      } else {
        await updateComment(comment._id, { content });
        setOnEdit(false);
      }
    } else {
      setOnEdit(false);
    }

    if (!content.trim()) {
      setContent(comment.content);
      setOnEdit(false);
    }
  };

  const OnOffReply = () => {
    setOnReply(!onReply);
    setReply(commentId);
  };

  const reloadHeartComment = () => {
    fGetHeartComment(comment._id);
    if (isLike) SetIsLike(false);
  };

  const reloadRLCM = () => {
    reloadReplyComment();
  };

  return (
    <div className="comment-card mt-2">
      <Link
        to={`/profile/${comment.writer.username}`}
        className="d-flex text-dark"
      >
        <Avatar user={comment.writer} size="small-avatar" />
        <h6 className="mx-1">{comment.writer.username}</h6>
      </Link>

      <div className="comment-content">
        <div className="flex-fill">
          {onEdit ? (
            <textarea
              autoFocus
              rows="5"
              spellCheck={false}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>
              {comment.tag && comment.tag._id !== comment.writer._id && (
                <Link to={`/profile/${comment.tag.username}`}>
                  {comment.tag.username}
                  {"  "}
                </Link>
              )}
              <span>
                {content.length < 100
                  ? content
                  : readMore
                  ? content + " "
                  : content.slice(0, 100) + "......"}
              </span>
              {content.length > 100 &&
                (readMore ? (
                  <p
                    onClick={() => setReadMore(!readMore)}
                    className="readMore"
                  >
                    ???n b???t
                  </p>
                ) : (
                  <span
                    onClick={() => setReadMore(!readMore)}
                    className="readMore"
                  >
                    Xem th??m
                  </span>
                ))}
            </div>
          )}

          <div className="no-select" style={{ cursor: "pointer" }}>
            <small className="text-muted mr-3">
              {moment(comment.createdAt).fromNow()}
            </small>
            <small className="font-weight-bold mr-3">
              {totalHeartComment} th??ch
            </small>
            {onEdit ? (
              <>
                <small
                  className="font-weight-bold mr-3"
                  onClick={onUpdateComment}
                >
                  c???p nh???t
                </small>
                <small
                  className="font-weight-bold mr-3"
                  onClick={() => setOnEdit(false)}
                >
                  hu???
                </small>
              </>
            ) : (
              <>
                <small className="font-weight-bold mr-3" onClick={OnOffReply}>
                  {onReply ? "hu???" : "tr??? l???i"}
                </small>
                <span title="C???p nh???t tr??? l???i" onClick={reloadRLCM}>
                  <i
                    className="fas fa-sync-alt"
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer", marginLeft: "2rem" }}
        >
          <CommentMenu
            post={post}
            comment={comment}
            user={user}
            setOnEdit={setOnEdit}
            reloadReplyComment={reloadReplyComment}
            reloadComment={reloadComment}
            reloadHeartComment={reloadHeartComment}
          />

          {!isLike ? (
            <>
              <i onClick={dropAndUnHeart} className="far fa-heart"></i>
            </>
          ) : (
            <>
              <i
                onClick={dropAndUnHeart}
                className="fas fa-heart text-danger"
              ></i>
            </>
          )}
        </div>
      </div>

      {onReply && (
        <InputComment
          setOnReply={setOnReply}
          post={post}
          comment={comment}
          user={user}
          reply={reply}
          reloadReplyComment={reloadReplyComment}
          reloadComment={reloadComment}
        >
          <Link to={`/profile/${comment.writer.username}`}>
            @{comment.writer.username}:
          </Link>
        </InputComment>
      )}
      {children}
    </div>
  );
}

export default CommentCard;

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

function CommentCard({ post, comment, user }) {
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const [isLike, SetIsLike] = useState(false);
  const [totalHeartComment, setTotalHeartComment] = useState(0);
  const [heartComments, setHeartComments] = useState([]);

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
    const variable = {
      commentId: comment._id,
    };
    const data = await dropHeartComment(variable);
    if (data.success) {
      SetIsLike(true);
      setTotalHeartComment(totalHeartComment + 1);
    }
  };

  const fUnHeartComment = async () => {
    const data = await unHeartComment(comment._id);
    if (data.success) {
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
      if (user._id !== comment.user._id) {
        setContent(comment.content);
        setOnEdit(false);
        return;
      }
      await updateComment(comment._id, { content });
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }

    if (!content.trim()) {
      setContent(comment.content);
      setOnEdit(false);
    }
  };

  return (
    <div className="comment-card mt-2">
      <Link
        to={`/profile/${post.writer.username}`}
        className="d-flex text-dark"
      >
        <Avatar user={post.writer} size="small-avatar" />
        <h6 className="mx-1">{comment.user.username}</h6>
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
                    Ẩn bớt
                  </p>
                ) : (
                  <span
                    onClick={() => setReadMore(!readMore)}
                    className="readMore"
                  >
                    Xem thêm
                  </span>
                ))}
            </div>
          )}

          <div style={{ cursor: "pointer" }}>
            <small className="text-muted mr-3">
              {moment(comment.createdAt).fromNow()}
            </small>
            <small className="font-weight-bold mr-3">
              {totalHeartComment} thích
            </small>
            {onEdit ? (
              <>
                <small
                  className="font-weight-bold mr-3"
                  onClick={onUpdateComment}
                >
                  cập nhật
                </small>
                <small
                  className="font-weight-bold mr-3"
                  onClick={() => setOnEdit(false)}
                >
                  huỷ
                </small>
              </>
            ) : (
              <small className="font-weight-bold mr-3">trả lời</small>
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
    </div>
  );
}

export default CommentCard;

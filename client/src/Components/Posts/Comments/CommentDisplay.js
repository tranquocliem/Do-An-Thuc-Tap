import React, { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { getReplyComment } from "../../../Service/ReplyCommentService";
import ImgLoading from "../../../img/loading.gif";

function CommentDisplay({ post, comment, user, reloadComment }) {
  const [replycomments, setReplyComments] = useState([]);
  const [totalReplyComments, setTotalReplyComments] = useState(0);
  const [loadingReplyComment, setLoadingReplyComment] = useState(true);

  const [limit, setLimit] = useState(1);
  const [loadingShowReplyComment, setLoadingShowReplyComment] = useState(false);

  const fGetReplyComment = async (id, reply, limit) => {
    if (!id || id !== post._id || reply !== comment._id) return;
    const data = await getReplyComment(id, reply, limit);
    setReplyComments(data.Replycomments);
    setTotalReplyComments(data.total);
  };

  useEffect(() => {
    const fGetReplyComment = async (id, reply, limit) => {
      const data = await getReplyComment(id, reply, limit);
      setReplyComments(data.Replycomments);
      setTotalReplyComments(data.total);
      setLoadingReplyComment(false);
      setLoadingShowReplyComment(false);
    };
    return fGetReplyComment(post._id, comment._id, limit);
  }, [post._id, comment._id, limit]);

  const reloadReplyComment = async () => {
    await fGetReplyComment(post._id, comment._id, limit);
    setLimit(totalReplyComments + 1);
  };

  const showReplyComment = () => {
    setLoadingShowReplyComment(true);
    setLimit(totalReplyComments);
  };

  const hideReplyComment = () => {
    setLimit(1);
  };

  return (
    <div className="comment-display">
      <CommentCard
        commentId={comment._id}
        user={user}
        comment={comment}
        post={post}
        reloadReplyComment={reloadReplyComment}
        reloadComment={reloadComment}
      >
        {loadingReplyComment && totalReplyComments > 0 ? (
          <img
            className="d-block mx-auto"
            style={{ width: "25px" }}
            src={ImgLoading}
            alt="loading-comments"
          />
        ) : (
          <div style={{ paddingLeft: "1rem" }}>
            {replycomments.map(
              (item, i) =>
                item.reply && (
                  <CommentCard
                    commentId={comment._id}
                    key={i}
                    comment={item}
                    post={post}
                    user={user}
                    reloadComment={reloadComment}
                    reloadReplyComment={reloadReplyComment}
                  />
                )
            )}
          </div>
        )}
        {loadingShowReplyComment && (
          <img
            style={{ marginLeft: "25px", width: "25px" }}
            src={ImgLoading}
            alt="loading-comments"
          />
        )}
        {totalReplyComments > limit ? (
          <div
            className="show-and-hide-comment no-select p-2 border-top"
            style={{ cursor: "pointer" }}
            onClick={showReplyComment}
          >
            Xem tất cả trả lời
          </div>
        ) : (
          totalReplyComments > 1 &&
          !loadingShowReplyComment && (
            <div
              className="show-and-hide-comment no-select p-2 border-top"
              style={{ cursor: "pointer" }}
              onClick={hideReplyComment}
            >
              Ẩn bớt trả lời
            </div>
          )
        )}
      </CommentCard>
    </div>
  );
}

export default CommentDisplay;

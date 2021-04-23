import React from "react";
import { deleteReplyComment } from "../../../Service/ReplyCommentService";
import { deleteComment } from "../../../Service/CommentService";

function CommentMenu({
  post,
  comment,
  user,
  setOnEdit,
  reloadReplyComment,
  reloadComment,
  reloadHeartComment,
}) {
  const deleteCommentAndReply = () => {
    if (comment.reply) {
      deleteReplyComment(comment._id);
      reloadReplyComment();
      reloadHeartComment();
    } else {
      deleteComment(comment._id);
      reloadComment();
      reloadHeartComment();
    }
  };
  const MenuItem = () => {
    return (
      <>
        <div
          className="dropdown-item no-select"
          onClick={() => setOnEdit(true)}
        >
          <i className="fas fa-edit"></i> Chỉnh sửa
        </div>
        <div
          className="dropdown-item no-select"
          onClick={deleteCommentAndReply}
        >
          <i className="fas fa-trash-alt"></i> Xoá
        </div>
      </>
    );
  };

  return (
    <>
      <div className="menu">
        {(post.writer._id === user._id || comment.writer._id === user._id) && (
          <div className="nav-item dropdown no-select">
            <i
              className="fas fa-ellipsis-v"
              id="moreLink"
              data-toggle="dropdown"
            ></i>
            <div className="dropdown-menu " aria-labelledby="moreLink">
              {post.writer._id === user._id ? (
                comment.writer._id === user._id ? (
                  MenuItem()
                ) : (
                  <div
                    className="dropdown-item no-select"
                    onClick={deleteCommentAndReply}
                  >
                    <i className="fas fa-trash-alt"></i> Xoá
                  </div>
                )
              ) : (
                comment.writer._id === user._id && MenuItem()
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CommentMenu;

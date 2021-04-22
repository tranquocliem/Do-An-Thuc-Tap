import React from "react";

function CommentMenu({ post, comment, user, setOnEdit }) {
  const deleteComment = () => {
    alert("Xoá nè");
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
        <div className="dropdown-item no-select" onClick={deleteComment}>
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
                    onClick={deleteComment}
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

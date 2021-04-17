import React, { useState } from "react";
import { Link } from "react-router-dom";

function CardFooter(props) {
  const [isLike, SetIsLike] = useState(false);
  const [savePost, setSavePost] = useState(false);
  return (
    <div className="card_footer">
      <div className="card-icon-menu">
        <div>
          {!isLike ? (
            <i onClick={() => SetIsLike(!isLike)} className="far fa-heart"></i>
          ) : (
            <i
              onClick={() => SetIsLike(!isLike)}
              className="fas fa-heart text-danger"
            ></i>
          )}
          <Link
            to={`/post/${props.post && props.post._id}`}
            className="text-dark"
          >
            <i className="far fa-comment"></i>
          </Link>
          <i className="far fa-paper-plane"></i>
        </div>
        {!savePost ? (
          <i
            title="Lưu bài viết"
            onClick={() => setSavePost(!savePost)}
            className="far fa-bookmark"
          ></i>
        ) : (
          <i
            title="Đã lưu bài viết"
            onClick={() => setSavePost(!savePost)}
            className="fas fa-bookmark text-primary"
          ></i>
        )}
      </div>
      <div className="d-flex justify-content-between">
        <h6 style={{ padding: "0 34px", cursor: "pointer" }}>
          {props.post && props.post.likes.length}
        </h6>
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {props.post && props.post.comments.length} bình luận
        </h6>
      </div>
    </div>
  );
}

export default CardFooter;

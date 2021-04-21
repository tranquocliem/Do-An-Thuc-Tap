import React, { useEffect, useState } from "react";
import CommentDisplay from "../Comments/CommentDisplay";
import { getComment } from "../../../Service/CommentService";
import InputComment from "../Comments/InputComment";
import ImgLoading from "../../../img/loading.gif";

function CommentDetail({ post, user, postId }, props) {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loadingComment, setLoadingComment] = useState(false);

  const [limit, setLimit] = useState(3);

  const fGetComment = async (id, limit) => {
    const data = await getComment(id, limit);
    setComments(data.comments);
    setTotalComments(data.total);
  };

  useEffect(() => {
    const fGetComment = async (id, limit) => {
      const data = await getComment(id, limit);
      setComments(data.comments);
      setTotalComments(data.total);
    };
    return fGetComment(postId, limit);
  }, [postId, limit]);

  const reload = () => {
    setLoadingComment(true);
    setTimeout(() => {
      fGetComment(post._id, limit);
      setLoadingComment(false);
    }, 300);
  };

  const showComment = () => {
    setLimit(totalComments);
  };

  const hideComment = () => {
    setLimit(3);
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {totalComments} bình luận
        </h6>
      </div>
      <InputComment reload={reload} post={post} user={user} />
      <div className="comments" style={{ opacity: loadingComment && 0.5 }}>
        {loadingComment && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              textAlign: "center",
              zIndex: 15,
            }}
          >
            <img
              style={{ width: "55px" }}
              src={ImgLoading}
              alt="loading-comments"
            />
          </div>
        )}
        {comments.map((comment) => (
          <CommentDisplay
            user={user}
            key={comment._id}
            comment={comment}
            post={post}
          />
        ))}

        {totalComments > limit ? (
          <div
            className="show-and-hide-comment no-select p-2 border-top"
            style={{ cursor: "pointer" }}
            onClick={showComment}
          >
            Xem tất cả bình luận
          </div>
        ) : (
          totalComments > 0 && (
            <div
              className="show-and-hide-comment no-select p-2 border-top"
              style={{ cursor: "pointer" }}
              onClick={hideComment}
            >
              Ẩn bớt bình luận
            </div>
          )
        )}
      </div>
    </>
  );
}

export default CommentDetail;

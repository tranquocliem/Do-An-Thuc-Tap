import React, { useState } from "react";
import { createComment } from "../../../Service/CommentService";
import { createReplyComment } from "../../../Service/ReplyCommentService";
import "./comments.css";
import { MyToast } from "../../Toastify/toast";

function InputComment({
  post,
  comment,
  reloadComment,
  children,
  setOnReply,
  user,
  reply,
  reloadReplyComment,
}) {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (reply) {
      try {
        const newReplyComment = {
          postId: post._id,
          postUserId: post.writer._id,
          content,
          tag: comment.writer,
          reply,
        };
        await createReplyComment(newReplyComment);

        setContent("");
        setOnReply(false);
        reloadComment();
        reloadReplyComment();
      } catch (error) {
        reloadComment();
        reloadReplyComment();
        MyToast("err", "Bài viết hoặc bình luận không tồn tại");
      }
    } else {
      try {
        const newComment = {
          postId: post._id,
          postUserId: post.writer._id,
          content,
        };
        await createComment(newComment);
        setContent("");
        reloadComment();
      } catch (error) {
        MyToast("err", "Bài viết hoặc bình luận không tồn tại");
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="card-footer comment-input">
        {children}
        <input
          type="text"
          placeholder="Thêm bình luận..."
          spellCheck={false}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="postBtn">
          Đăng
        </button>
      </form>
    </>
  );
}

export default InputComment;

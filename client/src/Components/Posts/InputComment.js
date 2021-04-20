import React, { useState } from "react";
import { createComment } from "../../Service/CommentService";
import "./comments.css";

function InputComment({ children, post, user }) {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const newComment = {
      postId: post._id,
      content,
      likes: [],
      user: user,
      createAt: new Date().toISOString(),
    };

    const data = await createComment(newComment);

    console.log(data);
  };

  return (
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
  );
}

export default InputComment;

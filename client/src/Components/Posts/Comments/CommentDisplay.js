import React from "react";
import CommentCard from "./CommentCard";

// import { Container } from './styles';

function CommentDisplay({ post, comment, user }) {
  return (
    <div className="comment-display">
      <CommentCard user={user} comment={comment} post={post}></CommentCard>
    </div>
  );
}

export default CommentDisplay;

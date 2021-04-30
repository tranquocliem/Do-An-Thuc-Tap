/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getHeartPost } from "../../../Service/HeartService";
import { getComment } from "../../../Service/CommentService";
function PostThunbMenu({ post }) {
  const [totalHearts, setTotalHearts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const fGetHeartPost = async (id) => {
    if (post.postId) {
      if (!id || id !== post.postId._id) return;
    }
    const data = await getHeartPost(id);
    if (data.success) {
      setTotalHearts(data.total);
    }
  };

  const fGetComment = async (id) => {
    const data = await getComment(id);
    if (data.success) {
      setTotalComments(data.total);
    }
  };

  useEffect(() => {
    if (post.postId) {
      fGetHeartPost(post.postId._id);
      fGetComment(post.postId._id);
    }
    fGetHeartPost(post._id);
    fGetComment(post._id);
  }, [post._id, post.postId]);

  return (
    <div className="post-thumb-menu">
      <i className="far fa-heart">{totalHearts}</i>
      <i className="far fa-comment">{totalComments}</i>
    </div>
  );
}

export default PostThunbMenu;

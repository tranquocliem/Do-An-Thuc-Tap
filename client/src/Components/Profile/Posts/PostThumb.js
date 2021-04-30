import React from "react";
import { Link } from "react-router-dom";
import PostThunbMenu from "./PostThumbMenu";

function PostThumb({ posts, totalPosts }) {
  return (
    <div className="post-thumb">
      {posts &&
        posts.map((post) => (
          <Link
            key={!post.postId ? post._id : post.postId._id}
            to={`/post/${!post.postId ? post._id : post.postId._id}`}
          >
            <div className="post-thumb-display">
              <img
                src={
                  !post.postId ? post.images[0].url : post.postId.images[0].url
                }
                alt={
                  !post.postId ? post.images[0].url : post.postId.images[0].url
                }
              />
              <PostThunbMenu post={post} />
            </div>
          </Link>
        ))}
    </div>
  );
}

export default PostThumb;

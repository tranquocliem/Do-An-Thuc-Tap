import React from "react";
import { Link } from "react-router-dom";
import PostThunbMenu from "./PostThumbMenu";

function PostThumb({ posts, totalPosts }) {
  return (
    <div className="post-thumb">
      {posts &&
        posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}`}>
            <div className="post-thumb-display">
              <img src={post.images[0].url} alt={post.images[0].url} />
              <PostThunbMenu post={post} />
            </div>
          </Link>
        ))}
    </div>
  );
}

export default PostThumb;

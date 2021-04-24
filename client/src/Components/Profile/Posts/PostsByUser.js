import React, { useEffect, useState } from "react";
import { getPostByWriter } from "../../../Service/PostService";
import PostThumb from "./PostThumb";
import ImgLoading from "../../../img/loading.gif";
import "./postbywriter.css";

function PostsByUser({ user }) {
  const [posts, setPosts] = useState();
  const [totalPosts, SetTotalPosts] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hidenLoading, setHidenLoading] = useState(false);

  const fgetPostByWriter = async (id) => {
    const data = await getPostByWriter(id);
    if (data.success) {
      setPosts(data.posts);
      SetTotalPosts(data.total);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    setHidenLoading(true);
    setTimeout(() => {
      setLoadingPosts(true);
      setHidenLoading(false);
    }, 400);
    setTimeout(() => {
      user._id && fgetPostByWriter(user._id);
    }, 1000);
  }, [user._id]);

  return (
    <>
      <div className="container" style={{ display: hidenLoading && "none" }}>
        {loadingPosts ? (
          <img
            style={{ display: hidenLoading ? "none" : "block" }}
            className="mx-auto"
            src={ImgLoading}
            alt="img-loading"
          />
        ) : totalPosts > 0 ? (
          <PostThumb posts={posts} totalPosts={totalPosts} />
        ) : (
          <h2 className="mt-4 text-no-post text-center">Không có bài viết!</h2>
        )}
      </div>
    </>
  );
}

export default PostsByUser;

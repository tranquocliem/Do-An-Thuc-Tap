import React, { useEffect, useState } from "react";
import { getPost } from "../../Service/PostService";
import MyHelmet from "../Helmet/MyHelmet";
import Posts from "../Posts/Posts";
import Status from "../Status/Status";
import ImgLoading from "../../img/loading.gif";
import "./home.css";

function Home(props) {
  const [posts, setPosts] = useState();
  const [loadingPost, setLoadingPost] = useState(false);
  const [totalPost, setTotalPost] = useState(0);

  const getPosts = async () => {
    const data = await getPost();
    if (data.posts) {
      setPosts(data.posts);
      setTotalPost(data.total);
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    setLoadingPost(true);
    setTimeout(() => {
      getPosts();
    }, 600);
  }, []);

  const reloadPost = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoadingPost(true);
    setTimeout(() => {
      getPosts();
    }, 600);
  };

  return (
    <>
      <MyHelmet
        title="𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵 - Trang Chủ"
        description="Trang mạng xã hội chia sẽ hình ảnh"
      />
      <div className="container">
        <div className="row home mx-0">
          <div className="col-md-8">
            <Status reloadPost={reloadPost} />
            {loadingPost ? (
              <img
                src={ImgLoading}
                alt="loading-posts"
                className="d-block mx-auto no-select"
              />
            ) : totalPost === 0 ? (
              <h2 className="text-no-post text-center">Không có bài viết!</h2>
            ) : (
              <Posts posts={posts} />
            )}
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </>
  );
}

export default Home;

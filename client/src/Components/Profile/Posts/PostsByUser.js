/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getPostByWriter } from "../../../Service/PostService";
import PostThumb from "./PostThumb";
import ImgLoading from "../../../img/loading.gif";
import "./postbywriter.css";

function PostsByUser({ user, setHideSaveTab }) {
  const [posts, setPosts] = useState([]);
  const [totalPosts, SetTotalPosts] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hidenLoading, setHidenLoading] = useState(false);

  const [hidenBtnLoadMore, setHidenBtnLoadMore] = useState(false);
  const [dem, setdem] = useState(1);
  const [skip, setSkip] = useState(0);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  const fgetPostByWriter = async (id, skip) => {
    const data = await getPostByWriter(id, skip);
    if (data.success) {
      setPosts([data.posts]);
      SetTotalPosts(data.total);
      setLoadingPosts(false);
      setHidenLoading(false);
      setHidenBtnLoadMore(false);
      setHideSaveTab(false);
    }
  };

  const fLoadMorePostByWriter = async (id, skip) => {
    const data = await getPostByWriter(id, skip);
    if (data.success) {
      setPosts([...posts, data.posts]);
      SetTotalPosts(data.total);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    setHidenLoading(true);
    setHidenBtnLoadMore(true);
    setLoadingPosts(true);
    setHideSaveTab(true);
    user._id && fgetPostByWriter(user._id, 0);

    // setHidenLoading(true);
    // setHidenBtnLoadMore(true);
    // setTimeout(() => {
    //   setLoadingPosts(true);
    //   setHidenLoading(false);
    // }, 550);
    // setTimeout(() => {
    //   user._id && fgetPostByWriter(user._id, 0);
    // }, 1000);
    // setTimeout(() => {
    //   setHidenBtnLoadMore(false);
    // }, 1099);
  }, [user._id]);

  const totalLoadmore = Math.ceil(totalPosts / 4);

  const loadMore = async () => {
    if (totalLoadmore === dem || totalPosts <= 4) return;

    setLoadingLoadMore(true);
    const Skip = skip + 4;
    const Dem = dem + 1;
    setSkip(Skip);
    setdem(Dem);
    await fLoadMorePostByWriter(user._id, Skip);
    setLoadingLoadMore(false);
  };

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
          posts &&
          posts.map((post, index) => (
            <PostThumb key={index} posts={post} totalPosts={totalPosts} />
          ))
        ) : (
          <h2 className="mt-4 text-no-post text-center">Không có bài viết!</h2>
        )}
        {loadingLoadMore && (
          <img
            className="d-block mx-auto"
            style={{ width: "40px" }}
            src={ImgLoading}
            alt="load-more"
          />
        )}
        {totalPosts <= 4 || totalLoadmore === dem ? null : (
          <button
            onClick={loadMore}
            style={{ display: hidenBtnLoadMore ? "none" : "block" }}
            type="button"
            className="mx-auto mb-4 btn btn-dark"
          >
            Xem thêm
          </button>
        )}
      </div>
    </>
  );
}

export default PostsByUser;

import React, { useEffect, useState } from "react";
import PostThumb from "./PostThumb";
import ImgLoading from "../../../img/loading.gif";
import "./postbywriter.css";
import { getSavePostByUser } from "../../../Service/SavePostService";

function SavePost({ user }) {
  const [savePosts, setSavePosts] = useState([]);
  const [totalSavePosts, SetTotalSavePosts] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hidenLoading, setHidenLoading] = useState(false);

  const [hidenBtnLoadMore, setHidenBtnLoadMore] = useState(false);
  const [dem, setdem] = useState(1);
  const [skip, setSkip] = useState(0);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  const fGetSavePostByUser = async (skip) => {
    const data = await getSavePostByUser(skip);
    if (data.success) {
      setSavePosts([data.savePost]);
      SetTotalSavePosts(data.total);
      setLoadingPosts(false);
    }
  };

  const fLoadMoreSavePostByUser = async (skip) => {
    const data = await getSavePostByUser(skip);
    if (data.success) {
      setSavePosts([...savePosts, data.savePost]);
      SetTotalSavePosts(data.total);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    setHidenLoading(true);
    setHidenBtnLoadMore(true);
    setTimeout(() => {
      setLoadingPosts(true);
      setHidenLoading(false);
    }, 550);
    setTimeout(() => {
      user._id && fGetSavePostByUser();
    }, 1000);
    setTimeout(() => {
      setHidenBtnLoadMore(false);
    }, 1099);
  }, [user._id]);

  const totalLoadmore = Math.ceil(totalSavePosts / 4);

  const loadMore = async () => {
    if (totalLoadmore === dem || totalSavePosts <= 4) return;

    setLoadingLoadMore(true);
    const Skip = skip + 4;
    const Dem = dem + 1;
    setSkip(Skip);
    setdem(Dem);
    await fLoadMoreSavePostByUser(Skip);
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
        ) : totalSavePosts > 0 ? (
          savePosts &&
          savePosts.map((post, index) => (
            <PostThumb key={index} posts={post} totalPosts={totalSavePosts} />
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
        {totalSavePosts <= 4 || totalLoadmore === dem ? null : (
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

export default SavePost;

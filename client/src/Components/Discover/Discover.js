import React, { useEffect, useState } from "react";
import { getPostDiscover } from "../../Service/PostService";
import PostThumb from "../Profile/Posts/PostThumb";
import ImgLoading from "../../img/loading.gif";

function Discover() {
  const [posts, setPosts] = useState([]);
  const [totalPosts, SetTotalPosts] = useState();
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [hidenBtnLoadMore, setHidenBtnLoadMore] = useState(false);
  const [dem, setdem] = useState(1);
  const [skip, setSkip] = useState(0);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  const fgetPostDiscover = async (skip) => {
    const data = await getPostDiscover(skip);
    if (data.success) {
      setPosts([data.posts]);
      SetTotalPosts(data.total);
      setLoadingPosts(false);
      setHidenBtnLoadMore(false);
    }
  };

  const fLoadMorePostDiscover = async (skip) => {
    const data = await getPostDiscover(skip);
    if (data.success) {
      setPosts([...posts, data.posts]);
      SetTotalPosts(data.total);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    setHidenBtnLoadMore(true);
    setLoadingPosts(true);
    fgetPostDiscover(0);
  }, []);

  const totalLoadmore = Math.ceil(totalPosts / 8);

  const loadMore = async () => {
    if (totalLoadmore === dem || totalPosts <= 4) return;

    setLoadingLoadMore(true);
    const Skip = skip + 8;
    const Dem = dem + 1;
    setSkip(Skip);
    setdem(Dem);
    await fLoadMorePostDiscover(Skip);
    setLoadingLoadMore(false);
  };

  return (
    <div className="container">
      {loadingPosts ? (
        <img
          className="d-block mx-auto mt-4 no-select"
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
          className="d-block mx-auto no-select"
          style={{ width: "40px" }}
          src={ImgLoading}
          alt="load-more"
        />
      )}
      {totalPosts <= 8 || totalLoadmore === dem ? null : (
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
  );
}

export default Discover;

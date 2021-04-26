/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { getPost } from "../../Service/PostService";
import MyHelmet from "../Helmet/MyHelmet";
import Posts from "../Posts/Posts";
import Status from "../Status/Status";
import ImgLoading from "../../img/loading.gif";
import "./home.css";
import Suggestions from "../Suggestions/Suggestions";
import { suggestions } from "../../Service/AccountService";
import { AuthContext } from "../../Context/AuthContext";
import { MyToast } from "../Toastify/toast";
import { follow, unFollow } from "../../Service/FollowService";
import { Waypoint } from "react-waypoint";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [totalPost, setTotalPost] = useState(1);

  const [suggestionsUser, setSuggestionsUser] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [dem, setdem] = useState(1);
  const [skip, setSkip] = useState(0);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  const [okScroll, setOkScroll] = useState(true);
  const [hideWaypoint, setHideWaypoint] = useState(false);

  const { user } = useContext(AuthContext);

  const userID = user._id;

  const getPosts = async (variable) => {
    const data = await getPost(variable);
    if (data.posts) {
      setPosts([...posts, data.posts]);
      setTotalPost(data.total);
    }
  };

  const getPostsForCreate = async (variable) => {
    const data = await getPost(variable);
    if (data.posts) {
      setPosts([data.posts]);
      setTotalPost(data.total);
    }
  };

  useEffect(() => {
    setLoadingPost(true);
    setTimeout(() => {
      setLoadingPost(false);
    }, 600);
  }, []);

  useEffect(() => {
    const variable = {
      skip,
    };
    const getPosts = async (variable) => {
      const data = await getPost(variable);
      if (data.posts) {
        setPosts([...posts, data.posts]);
        setTotalPost(data.total);
      }
    };
    setTimeout(() => {
      getPosts(variable);
    }, 600);
  }, []);

  const totalLoadmore = Math.ceil(totalPost / 3);

  const infiniteScroll = async () => {
    if (totalLoadmore === dem || totalPost <= 3) return;

    setLoadingLoadMore(true);

    setOkScroll(false);

    if (okScroll) {
      try {
        const Skip = skip + 3;
        const Dem = dem + 1;
        const variable = {
          skip: Skip,
        };
        setSkip(Skip);
        setdem(Dem);
        await getPosts(variable);
        setLoadingLoadMore(false);
        setOkScroll(true);
      } catch (error) {
        console.log(error);
      }
      //   setTimeout(() => {
      //     const Skip = skip + 3;
      //     const Dem = dem + 1;
      //     const variable = {
      //       skip: Skip,
      //     };
      //     setSkip(Skip);
      //     setdem(Dem);
      //     getPosts(variable);
      //     setLoadingLoadMore(false);
      //     setOkScroll(true);
      //   }, 650);
    }
  };

  // window.onscroll = function () {
  //   const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     infiniteScroll();
  //   }
  // };

  const reloadPost = async () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoadingPost(true);
      setHideWaypoint(true);
      const variable = {
        skip: 0,
      };
      setPosts([]);
      setSkip(0);
      setdem(1);
      await getPostsForCreate(variable);
      setLoadingPost(false);
      setHideWaypoint(false);
    } catch (error) {
      console.log(error);
    }

    // window.scrollTo({ top: 0.1, behavior: "smooth" });
    // setLoadingPost(true);
    // const variable = {
    //   skip: 0,
    // };
    // setPosts([]);
    // setSkip(0);
    // setdem(1);
    // setTimeout(() => {
    //   getPostsForCreate(variable);
    //   setLoadingPost(false);
    // }, 600);

    // setTimeout(() => {
    //   window.location.reload();
    // }, 2700);
  };

  const getSuggestions = async (userID) => {
    try {
      const data = await suggestions();
      if (data.success) {
        setSuggestionsUser(data.users.filter((u) => u._id !== userID));
        setLoadingSuggestions(false);
      }
    } catch (error) {
      MyToast("err", "Có lỗi xãy ra");
    }
  };

  useEffect(() => {
    setLoadingSuggestions(true);
    setTimeout(() => {
      getSuggestions(userID);
    }, 500);
  }, [userID]);

  const reLoadSuggestions = () => {
    setLoadingSuggestions(true);
    setTimeout(() => {
      getSuggestions(userID);
    }, 500);
  };

  const onFollowAndUnFollow = (idUser, btnFollow, username) => {
    if (btnFollow) {
      const variable = {
        followers: idUser,
      };
      follow(variable).then((data) => {
        if (data.success) {
          MyToast("succ", `Đã theo dõi ${username}`);
        } else {
          MyToast("err", `Bạn đã ${data.message.msgBody} ${username} rồi`);
        }
      });
    } else {
      const variable = {
        followers: idUser,
      };
      unFollow(variable).then((data) => {
        if (data.success) {
          MyToast("err", `Đã bỏ theo dõi ${username}`);
        } else {
          MyToast("err", `Lỗi!!!`);
        }
      });
    }
  };

  return (
    <>
      <MyHelmet
        title="𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵 - Trang Chủ"
        description="Trang mạng xã hội chia sẽ hình ảnh"
      />
      <div className="container">
        <div className="row home mx-0">
          <div className="col-md-7">
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
              posts.map((p, i) => (
                <div key={i}>
                  <Posts
                    user={user}
                    suggestionsUser={suggestionsUser}
                    loadingSuggestions={loadingSuggestions}
                    reLoadSuggestions={reLoadSuggestions}
                    onFollowAndUnFollow={onFollowAndUnFollow}
                    posts={p}
                  />
                </div>
              ))
            )}
            {loadingLoadMore && (
              <img
                className="d-block mx-auto"
                style={{ width: "50px" }}
                src={ImgLoading}
                alt="load-more"
              />
            )}
          </div>
          <div className="col-md-5">
            <Suggestions
              user={user}
              suggestionsUser={suggestionsUser}
              loadingSuggestions={loadingSuggestions}
              reLoadSuggestions={reLoadSuggestions}
              onFollowAndUnFollow={onFollowAndUnFollow}
              myUser={true}
              suggestions="suggestions"
              footer={true}
            />
          </div>
        </div>
        {totalPost <= 3 || dem === totalLoadmore || hideWaypoint ? null : (
          <Waypoint onEnter={infiniteScroll}></Waypoint>
        )}
      </div>
      <footer className="bg-light text-center text-lg-start mb-5"></footer>
    </>
  );
}

export default Home;

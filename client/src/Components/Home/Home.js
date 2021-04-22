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

function Home(props) {
  const [posts, setPosts] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [totalPost, setTotalPost] = useState(1);

  const [suggestionsUser, setSuggestionsUser] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [dem, setdem] = useState(1);
  const [skip, setSkip] = useState(0);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const [okScroll, setOkScroll] = useState(true);

  const { user } = useContext(AuthContext);

  const userID = user._id;

  const getPosts = async (variable) => {
    const data = await getPost(variable);
    if (data.posts) {
      setPosts([...posts, data.posts]);
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
    setTimeout(() => {
      getPosts(variable);
    }, 600);
  }, [skip]);

  const reloadPost = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoadingPost(true);
    setTimeout(() => {
      getPosts();
      setLoadingPost(false);
    }, 600);
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

  const totalLoadmore = Math.ceil(totalPost / 3);

  const infiniteScroll = () => {
    if (totalLoadmore <= 1) return;
    const Skip = skip + 3;
    const Dem = dem + 1;

    const variable = {
      skip: Skip,
    };

    setLoadingLoadMore(true);
    setSkip(Skip);
    setdem(Dem);
    setOkScroll(false);
    if (okScroll) {
      setTimeout(() => {
        getPosts(variable);
        setLoadingLoadMore(false);
        setOkScroll(true);
      }, 200);
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
            {totalPost <= 3 || dem === totalLoadmore ? null : (
              <Waypoint onEnter={infiniteScroll}></Waypoint>
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
      </div>
      <footer className="bg-light text-center text-lg-start mb-5"></footer>
    </>
  );
}

export default Home;

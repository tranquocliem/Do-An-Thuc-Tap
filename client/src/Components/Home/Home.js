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

function Home(props) {
  const [posts, setPosts] = useState();
  const [loadingPost, setLoadingPost] = useState(false);
  const [totalPost, setTotalPost] = useState(0);

  const [suggestionsUser, setSuggestionsUser] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { user } = useContext(AuthContext);

  const userID = user._id;

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
              <Posts
                user={user}
                suggestionsUser={suggestionsUser}
                loadingSuggestions={loadingSuggestions}
                reLoadSuggestions={reLoadSuggestions}
                onFollowAndUnFollow={onFollowAndUnFollow}
                posts={posts}
              />
            )}
          </div>
          <div className="col-md-4">
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

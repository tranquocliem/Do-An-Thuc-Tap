/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getUser, isAuthenticated } from "../../Service/AccountService";
import {
  getMyFollowing,
  getMyFollowers,
  getFollowing,
  getFollowers,
} from "../../Service/FollowService";
import MyHelmet from "../Helmet/MyHelmet";
import NotFound from "../NotFound/NotFound";
import Info from "./Info";
import PostsByUser from "./Posts/PostsByUser";
import SavePost from "./Posts/SavePost";
import "./profile.css";

function Profile() {
  const { user, setUser, socket } = useContext(AuthContext);
  const { username } = useParams();
  const [User, setUsers] = useState([]);
  const [edit, setEdit] = useState(true);
  const [loading, setloading] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [totalfollowing, setTotalFollowing] = useState();
  const [totalfollowers, setTotalFollowers] = useState();

  const [saveTab, setSaveTab] = useState(false);
  const [hideSaveTab, setHideSaveTab] = useState(false);

  const updateProfile = (id) => {
    if (id) {
      isAuthenticated().then((data) => {
        setUser(data.user);
      });
    }
  };

  const fGetMyFollowing = async () => {
    const data = await getMyFollowing();
    setFollowings(data.followings);
    setTotalFollowing(data.total);
  };

  const fGetMyFollowers = async () => {
    const data = await getMyFollowers();
    setFollowers(data.followers);
    setTotalFollowers(data.total);
  };

  const fGetFollowing = async (variable) => {
    const data = await getFollowing(variable);
    setFollowings(data.follow);
    setTotalFollowing(data.total);
  };

  const fGetFollowers = async (variable) => {
    const data = await getFollowers(variable);
    setFollowers(data.follow);
    setTotalFollowers(data.total);
  };

  const fGetUser = async () => {
    const data = await getUser(username);
    if (data.user) {
      setloading(false);
      const variable = {
        id: data.user._id,
      };
      setUsers(data.user);
      await fGetFollowing(variable);
      await fGetFollowers(variable);
    } else {
      setUsers("");
    }
  };

  useEffect(() => {
    if (user.username === username) {
      setloading(true);
      setHideSaveTab(true);
      setUsers(user);
      setEdit(true);
      fGetMyFollowing();
      fGetMyFollowers();
      setHideSaveTab(false);
      setTimeout(() => {
        setloading(false);
      }, 400);
    } else {
      setEdit(false);
      setloading(true);
      fGetUser();
      // setTimeout(() => {
      //   getUser(username).then((data) => {
      //     setloading(false);
      //     if (data.user) {
      //       const variable = {
      //         id: data.user._id,
      //       };
      //       getFollowing(variable).then((data) => {
      //         setFollowings(data.follow);
      //         setTotalFollowing(data.total);
      //       });
      //       getFollowers(variable).then((data) => {
      //         setFollowers(data.follow);
      //         setTotalFollowers(data.total);
      //       });
      //       setUsers(data.user);
      //     } else {
      //       setUsers("");
      //     }
      //   });
      // }, 400);
    }
  }, [user, username]);

  const onFollowAndUnFollow = () => {
    if (user.username === username) {
      getMyFollowing().then((data) => {
        setFollowings(data.followings);
        setTotalFollowing(data.total);
      });
      getMyFollowers().then((data) => {
        setFollowers(data.followers);
        setTotalFollowers(data.total);
      });
    } else {
      getUser(username).then((data) => {
        if (data.user) {
          const variable = {
            id: data.user._id,
          };
          getFollowing(variable).then((data) => {
            setFollowings(data.follow);
            setTotalFollowing(data.total);
          });
          getFollowers(variable).then((data) => {
            setFollowers(data.follow);
            setTotalFollowers(data.total);
          });
          setUsers(data.user);
        } else {
          setUsers("");
        }
      });
    }
  };

  // Real Time Follower
  useEffect(() => {
    socket.on("followToClient", async (userId) => {
      if (userId === user._id) {
        const data = await getMyFollowers(userId);
        setFollowers(data.followers);
        setTotalFollowers(data.total);
      }
      return;
    });

    return () => socket.off("followToClient");
  }, [socket]);
  useEffect(() => {
    socket.on("unFollowToClient", async (userId) => {
      if (userId === user._id) {
        const data = await getMyFollowers(userId);
        setFollowers(data.followers);
        setTotalFollowers(data.total);
      }
    });
    return () => socket.off("unFollowToClient");
  }, [socket]);

  if (User) {
    return (
      <>
        <MyHelmet
          title={
            User.fullname ? `${User.fullname} (@${User.username})` : "Instagirl"
          }
          description={`Trang cá nhân của ${User.fullname}`}
        />
        <div className="profile">
          <Info
            onFollowAndUnFollow={onFollowAndUnFollow}
            totalfollowing={totalfollowing}
            totalfollowers={totalfollowers}
            followings={followings}
            followers={followers}
            myUser={user}
            username={user.username}
            usernameParam={username}
            updateProfile={updateProfile}
            user={User}
            edit={edit}
            loading={loading}
          />
          {user.username === username && (
            <div
              style={{ display: hideSaveTab ? "none" : "" }}
              className="container profile-tab"
            >
              <button
                className={saveTab ? "" : "activce"}
                onClick={() => setSaveTab(false)}
              >
                Bài viết
              </button>
              <button
                className={saveTab ? "activce" : ""}
                onClick={() => setSaveTab(true)}
              >
                Bài Lưu
              </button>
            </div>
          )}
          {saveTab ? (
            <SavePost user={User} myUser={user} />
          ) : (
            <PostsByUser user={User} myUser={user} />
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        <MyHelmet
          title="Not Found"
          description="Trang mạng xã hội chia sẻ hình ảnh"
        />
        <NotFound />
      </>
    );
  }
}

export default Profile;

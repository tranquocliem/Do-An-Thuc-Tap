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
import "./profile.css";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const { username } = useParams();
  const [User, setUsers] = useState([]);
  const [edit, setEdit] = useState(true);
  const [loading, setloading] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [totalfollowing, setTotalFollowing] = useState();
  const [totalfollowers, setTotalFollowers] = useState();

  const updateProfile = (id) => {
    if (id) {
      isAuthenticated().then((data) => {
        setUser(data.user);
      });
    }
  };

  useEffect(() => {
    if (user.username === username) {
      setloading(true);
      setUsers(user);
      setEdit(true);
      getMyFollowing().then((data) => {
        setFollowings(data.followings);
        setTotalFollowing(data.total);
      });
      getMyFollowers().then((data) => {
        setFollowers(data.followers);
        setTotalFollowers(data.total);
      });
      setTimeout(() => {
        setloading(false);
      }, 400);
    } else {
      setEdit(false);
      setloading(true);
      setTimeout(() => {
        getUser(username).then((data) => {
          setloading(false);
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
      }, 400);
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
          <PostsByUser user={User} myUser={user} />
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

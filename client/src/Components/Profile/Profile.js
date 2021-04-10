import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getUser, isAuthenticated } from "../../Service/AccountService";
import MyHelmet from "../Helmet/MyHelmet";
import NotFound from "../NotFound/NotFound";
import Info from "./Info";
import Posts from "./Posts";
import "./profile.css";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const { username } = useParams();
  const [User, setUsers] = useState([]);
  const [edit, setEdit] = useState(true);
  const [loading, setloading] = useState(false);

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
            setUsers(data.user);
          } else {
            setUsers("");
          }
        });
      }, 400);
    }
  }, [user, username]);

  if (User) {
    return (
      <>
        <MyHelmet
          title={`${User.fullname} (@${User.username})`}
          description={`Trang cá nhân của ${User.fullname}`}
        />
        <div className="profile">
          <Info
            updateProfile={updateProfile}
            user={User}
            edit={edit}
            loading={loading}
          />
          <Posts user={User} />
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

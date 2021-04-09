import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { getUser } from "../../Service/AccountService";
import MyHelmet from "../Helmet/MyHelmet";
import NotFound from "../NotFound/NotFound";
import Info from "./Info";
import Posts from "./Posts";
import "./profile.css";

function Profile() {
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const [User, setUser] = useState([]);
  const [edit, setEdit] = useState(true);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (user.username === username) {
      setloading(true);
      setUser(user);
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
            setUser(data.user);
          } else {
            setUser("");
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
          <Info user={User} edit={edit} loading={loading} />
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

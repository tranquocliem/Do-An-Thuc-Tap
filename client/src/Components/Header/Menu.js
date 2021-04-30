import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../Service/AccountService";
import { AuthContext } from "../../Context/AuthContext";
import Avatar from "../Avatar/Avatar";
import {
  deleteAllNotify,
  deleteNotify,
  getNotify,
} from "../../Service/NotifyService";
import NotifyModal from "./NotifyModal";
import ImgNotify from "../../img/icons8-notification-100.png";
import AudioNotify from "../../audio/done-for-you-612.mp3";

function Menu() {
  const { setIsAuthenticated, user, setUser, socket } = useContext(AuthContext);
  const [notifies, setNotifies] = useState();
  const [totalNotifies, setTotalNotifies] = useState(1);
  const [sound, setSound] = useState(localStorage.getItem("sound"));
  const [openNotify, setOpenNotify] = useState(false);
  const [pauseNotify, setPauseNotify] = useState(false);

  const audioRef = useRef();

  const fGetNotify = async () => {
    const data = await getNotify();
    if (data.success) {
      setNotifies(data.notify);
      setTotalNotifies(data.total);
    }
  };

  const Logout = () => {
    logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  useEffect(() => {
    fGetNotify();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("sound")) {
      setSound(localStorage.getItem("sound"));
    } else {
      localStorage.setItem("sound", "off");
      setSound(localStorage.getItem("sound"));
    }
  }, []);

  const onSoundNotify = () => {
    localStorage.setItem("sound", "on");
    setSound("on");
  };

  const offSoundNotify = () => {
    localStorage.setItem("sound", "off");
    setSound("off");
  };

  const reloadDeleteNotify = async (id) => {
    setPauseNotify(true);
    await deleteNotify(id);
    await fGetNotify();
    setPauseNotify(false);
  };

  const deleteAllNotifies = async () => {
    setNotifies();
    setTotalNotifies(0);
    await deleteAllNotify();
  };

  const spawnNotification = (body, icon, url, title) => {
    let options = {
      body,
      icon,
    };
    let n = new Notification(title, options);

    n.onclick = (e) => {
      e.preventDefault();
      window.open(url, "_blank");
    };
  };

  // RealTime CreateNotify
  useEffect(() => {
    socket.on("createNotifyToClient", async (msg) => {
      await fGetNotify();
      if (sound === "on") audioRef.current.play();
      spawnNotification(
        msg.user.username + " " + msg.text,
        msg.user.avatar,
        msg.url,
        "INSTAGIRL"
      );
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, sound]);

  return (
    <>
      <audio style={{ display: "none" }} controls ref={audioRef}>
        <source src={AudioNotify} type="audio/mp3" />
      </audio>
      <div className="menu mx-auto">
        <ul className="navbar-nav flex-row">
          <li className="nav-item px-2">
            <NavLink
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="nav-link"
              exact
              to="/"
            >
              <i className="fas fa-home "></i>
            </NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/discover">
              <i className="fas fa-compass"></i>
            </NavLink>
          </li>

          <li className="nav-item dropdown px-2 ">
            <span
              className="nav-link position-relative avatar-header no-select"
              id="navbarDropdown"
              role="button"
              onClick={() => setOpenNotify(!openNotify)}
            >
              <span>
                <i
                  className="fa fa-heart"
                  style={{ color: totalNotifies > 0 ? "crimson" : "" }}
                ></i>
              </span>
              <span className="totalNotify">{totalNotifies}</span>
            </span>
            <div
              className={
                openNotify
                  ? "dropdown-my-menu activeNotify"
                  : "dropdown-my-menu"
              }
              aria-labelledby="navbarDropdown"
            >
              <div style={{ minWidth: "280px" }}>
                <div className="d-flex justify-content-between align-items-center px-3">
                  <h3>Thông báo</h3>
                  {sound === "on" ? (
                    <i
                      onClick={offSoundNotify}
                      className="fas fa-bell text-danger"
                      style={{ fontSize: "1.2rem", cursor: "pointer" }}
                    ></i>
                  ) : (
                    <i
                      onClick={onSoundNotify}
                      className="fas fa-bell-slash text-danger"
                      style={{ fontSize: "1.2rem", cursor: "pointer" }}
                    ></i>
                  )}
                </div>
                <hr className="mt-0" />
                {totalNotifies === 0 && (
                  <img
                    src={ImgNotify}
                    alt="img-notify"
                    className="d-block mx-auto"
                  />
                )}
                <div
                  className="body-notify"
                  style={{ maxHeight: "450px", overflowY: "scroll" }}
                >
                  {notifies &&
                    notifies.map((msg) => (
                      <NotifyModal
                        key={msg._id}
                        reloadDeleteNotify={reloadDeleteNotify}
                        sound={sound}
                        setSound={setSound}
                        msg={msg}
                        totalNotifies={totalNotifies}
                        setOpenNotify={setOpenNotify}
                      />
                    ))}
                </div>
                {pauseNotify && (
                  <div
                    className="no-select"
                    style={{
                      position: "absolute",
                      top: 0,
                      height: "100%",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.185)",

                      fontWeight: "900",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        color: "black",
                        transform: "translate(-50%,-50%)",
                      }}
                    >
                      Loading...
                    </p>
                  </div>
                )}
                <hr className="my-2" />
                <div
                  onClick={deleteAllNotifies}
                  className="text-end text-danger no-select"
                  style={{
                    fontSize: "16px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  Xoá Tất Cả
                </div>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown px-2">
            <span
              className="nav-link dropdown-toggle avatar-header no-select"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Avatar user={user} size="medium-avatar" />
            </span>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="dropdown-item"
                to={`/profile/${user.username}/`}
              >
                Trang cá nhân
              </Link>
              <Link className="dropdown-item" to="/saved">
                Cài đặt
              </Link>
              <div className="dropdown-divider" />
              <Link className="dropdown-item" to="/login" onClick={Logout}>
                Đăng xuất
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Menu;

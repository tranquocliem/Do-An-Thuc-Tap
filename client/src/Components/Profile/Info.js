import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import ImgLoading from "../../img/loading.gif";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";

function Info(props) {
  const [onModal, setOnModal] = useState(false);
  const [btnFollow, setBtnFollow] = useState(false);
  const offModal = () => {
    setOnModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const updateProfile = (id) => {
    props.updateProfile(id);
    setOnModal(false);
  };
  const onFollowAndUnFollow = (btnFollow) => {
    setBtnFollow(btnFollow);
  };
  if (props.user && !props.loading) {
    return (
      <>
        <div className="info">
          <div className="info-container">
            <Avatar user={props.user} size="super-avatar" />

            <div className="info-content">
              <div className="info-content-title">
                <h2>{props.user.username}</h2>

                {props.edit ? (
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={() => setOnModal(true)}
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <FollowBtn onFollowAndUnFollow={onFollowAndUnFollow} />
                )}
              </div>
              <div
                className="follow-btn no-select"
                style={{
                  pointerEvents:
                    props.username === props.usernameParam ? "unset" : "none",
                }}
              >
                <span className="mr-5 ">
                  {props.user.followers
                    ? btnFollow
                      ? props.user.followers.length + 1 + " Người theo dõi"
                      : props.user.followers.length + " Người theo dõi"
                    : null}
                </span>
                <span className="ml-5">
                  {props.user.followers
                    ? "Đang theo dõi " + props.user.following.length
                    : null}
                </span>
              </div>
              <h6>
                {props.user.fullname} {props.user.phone}
              </h6>
              <h6>{props.user.email}</h6>
              <a
                className="link-website"
                href={props.user.website}
                target="_blank"
                rel="noreferrer"
              >
                {props.user.website}
              </a>
              {props.user.story &&
                props.user.story.split("\n").map((s, i) => (
                  <p style={{ marginBottom: 5 }} key={i}>
                    {s}
                  </p>
                ))}
            </div>

            {props.usernameParam === props.username ? (
              <EditProfile
                onModal={onModal}
                offModal={offModal}
                updateProfile={updateProfile}
                user={props.user}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <img
        className="d-block mx-auto my-4"
        draggable="false"
        src={ImgLoading}
        alt="loading-info"
      />
    );
  }
}

export default Info;

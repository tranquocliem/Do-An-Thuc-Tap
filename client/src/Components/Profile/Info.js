import React, { useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import ImgLoading from "../../img/loading.gif";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";
import ListUsers from "../Header/ListUsers";

function Info(props) {
  const [onModal, setOnModal] = useState(false);
  const [followings, setFollowings] = useState();
  const [followers, setFollowers] = useState();
  const [onFLW, setOnFLW] = useState(false);
  const [onFLE, setOnFLE] = useState(false);
  const [fullAvatar, setFullAvatar] = useState(false);

  const offModal = () => {
    setOnModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateProfile = (id) => {
    props.updateProfile(id);
    setOnModal(false);
  };

  const onFollowAndUnFollow = () => {
    props.onFollowAndUnFollow();
  };

  useEffect(() => {
    const followings =
      props.followings &&
      props.followings.map((following) => following.followers);
    const followers =
      props.followers && props.followers.map((follower) => follower.following);
    setFollowings(followings);
    setFollowers(followers);
  }, [props.followings, props.followers]);

  const onFollowing = () => {
    setOnFLW(!onFLW);
  };

  const onFollower = () => {
    setOnFLE(!onFLE);
  };

  const fullScreenAvatar = () => {
    setFullAvatar(!fullAvatar);
  };

  if (props.user && !props.loading) {
    return (
      <>
        {/* Avatar Full */}
        <div>
          {fullAvatar ? (
            <div className="my-show" onClick={fullScreenAvatar}></div>
          ) : null}
          <div
            className="full-avatar my-modal no-select"
            style={!fullAvatar ? { display: "none", overflow: "hidden" } : null}
          >
            <img src={props.user.avatar} alt="avatar" />
          </div>
          <div
            style={
              !fullAvatar
                ? { display: "none", overflow: "hidden", pointerEvents: "none" }
                : null
            }
            className="my-modal d-flex justify-content-center mt-3"
            onClick={fullScreenAvatar}
          >
            <div
              style={
                !fullAvatar ? { display: "none", overflow: "hidden" } : null
              }
              className="close-avatar"
            >
              <button
                type="button"
                className="btn btn-danger btn-sm btn-floating"
              >
                X
              </button>
            </div>
          </div>
        </div>

        <div className="info">
          <div className="info-container">
            <div className="avatar-info" onClick={fullScreenAvatar}>
              <Avatar user={props.user} size="super-avatar" />
            </div>
            <div className="info-content">
              <div className="info-content-title">
                <h2>{props.user.username}</h2>

                {props.edit ? (
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={() => setOnModal(true)}
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                ) : (
                  <FollowBtn
                    myUser={props.myUser}
                    user={props.user}
                    onFollowAndUnFollow={onFollowAndUnFollow}
                    totalfollowers={props.totalfollowers}
                    setTotalFollowers={props.setTotalFollowers}
                  />
                )}
              </div>
              <div
                className="follow-btn no-select"
                style={{
                  pointerEvents:
                    props.username === props.usernameParam ? "unset" : "none",
                }}
              >
                <span className="mr-5" onClick={onFollower}>
                  {/* {props.user.followers
                    ? btnFollow
                      ? props.user.followers.length + 1 + " Ng?????i theo d??i"
                      : props.user.followers.length + " Ng?????i theo d??i"
                    : null} */}
                  {`${
                    props.totalfollowers ? props.totalfollowers : 0
                  } Ng?????i theo d??i`}
                </span>
                <span className="ml-5" onClick={onFollowing}>
                  {/* {props.user.followers
                    ? "??ang theo d??i " + props.user.following.length
                    : null} */}
                  {`??ang theo d??i ${
                    props.totalfollowing ? props.totalfollowing : 0
                  }`}
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

        {/* Modal Following */}
        <div>
          {onFLW ? <div className="my-show" onClick={onFollowing}></div> : null}
          <div
            className="my-modal"
            style={!onFLW ? { display: "none", overflow: "hidden" } : null}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    ??ang theo d??i
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={onFollowing}
                  />
                </div>
                <div className="modal-body">
                  {
                    <div className="list-users">
                      {followings &&
                        followings.map((fl, i) => (
                          <div key={fl._id + i} onClick={onFollowing}>
                            <ListUsers user={fl} border="border" />
                          </div>
                        ))}
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Followers */}
        <div>
          {onFLE ? <div className="my-show" onClick={onFollower}></div> : null}
          <div
            className="my-modal"
            style={!onFLE ? { display: "none", overflow: "hidden" } : null}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Nh???ng ng?????i ??ang theo d??i b???n
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={onFollower}
                  />
                </div>
                <div className="modal-body">
                  {
                    <div className="list-users">
                      {followers &&
                        followers.map((fl) => (
                          <div key={fl._id} onClick={onFollower}>
                            <ListUsers user={fl} border="border" />
                          </div>
                        ))}
                    </div>
                  }
                </div>
              </div>
            </div>
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

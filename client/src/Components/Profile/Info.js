import React from "react";
import Avatar from "../Avatar/Avatar";
import ImgLoading from "../../img/loading.gif";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";

function Info(props) {
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
                    data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@mdo"
                  >
                    Chỉnh sửa cá nhân
                  </button>
                ) : (
                  <FollowBtn />
                )}
              </div>
              <div className="follow-btn">
                <span className="mr-5">
                  {props.user.followers
                    ? props.user.followers.length + " Follower"
                    : null}
                </span>
                <span className="ml-5">
                  {props.user.followers
                    ? props.user.following.length + " Following"
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
              <p>{props.user.story}</p>
            </div>

            {<EditProfile user={props.user} />}

            {/* {onEdit && <EditProfile user={props.user} setOnEdit={setOnEdit} />} */}
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

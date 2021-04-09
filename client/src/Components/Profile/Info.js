import React from "react";
import Avatar from "../Avatar/Avatar";
import ImgLoading from "../../img/loading.gif";

function Info(props) {
  console.log(props.user);
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
                  <button className="btn btn-info">Chỉnh sửa cá nhân</button>
                ) : null}
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
          </div>
        </div>
      </>
    );
  } else {
    return <img src={ImgLoading} alt="loading-info" />;
  }
}

export default Info;

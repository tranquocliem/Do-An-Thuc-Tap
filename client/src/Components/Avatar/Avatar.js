import React from "react";

import "./avatar.css";

function Avatar(props) {
  return (
    <img
      src={props.user ? props.user.avatar || props.user.image : null}
      alt="avatar"
      className={props.size}
    />
  );
}

export default Avatar;

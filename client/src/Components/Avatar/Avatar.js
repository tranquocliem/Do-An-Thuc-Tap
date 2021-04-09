import React from "react";

import "./avatar.css";

function Avatar(props) {
  return <img src={props.user.avatar} alt="avatar" className={props.size} />;
}

export default Avatar;

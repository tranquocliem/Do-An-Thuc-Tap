import React from "react";
import Avatar from "../Avatar/Avatar";

function ListUsers(props) {
  return (
    <div className={`d-flex p-2 align-item-center ${props.border}`}>
      <Avatar user={props.user} size="big-avatar" />
      <div className="ml-1" style={{ transform: "translate(5px,-2px)" }}>
        <span className="d-block">{props.user.username}</span>
        <small style={{ opacity: "0.7" }}>{props.user.fullname}</small>
      </div>
    </div>
  );
}

export default ListUsers;

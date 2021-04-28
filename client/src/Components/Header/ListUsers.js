import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";

function ListUsers({ children, user, border }) {
  return (
    <div className={`d-flex p-2 align-item-center ${border}`}>
      <div>
        <Link
          key={user._id}
          to={`/profile/${user.username}/`}
          className="d-flex align-item-center"
        >
          <Avatar user={user} size="big-avatar" />
          <div className="ml-1" style={{ transform: "translate(5px,-2px)" }}>
            <span className="d-block">{user.username}</span>
            <small style={{ opacity: "0.7" }}>{user.fullname}</small>
          </div>
        </Link>
      </div>
      {children}
    </div>
  );
}

export default ListUsers;

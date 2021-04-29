import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import moment from "moment";
import "moment/locale/vi";

function NotifyModal({ msg, setOpenNotify, reloadDeleteNotify }) {
  const onDeleteNotify = () => {
    reloadDeleteNotify(msg._id);
  };

  return (
    <div
      className="body-notify"
      style={{ maxHeight: "450px", overflowY: "scroll" }}
    >
      <div className="px-2 mb-3">
        <div className="d-flex text-dark align-items-center">
          <Link to={`${msg.url}`} onClick={() => setOpenNotify(false)}>
            <Avatar user={msg.sender} size="big-avatar" />
          </Link>
          <Link
            className="text-dark"
            to={`${msg.url}`}
            onClick={() => setOpenNotify(false)}
          >
            <div className="mx-1 flex-fill" style={{ fontSize: "15px" }}>
              <div style={{ maxWidth: "160px", overflowWrap: "break-word" }}>
                <strong style={{ marginRight: "5px" }}>
                  {msg.sender.username}
                </strong>
                <span>{msg.text}</span>
              </div>
              {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
            </div>
          </Link>
          <div
            style={{ marginLeft: "15px", width: "10%", textAlign: "end" }}
            onClick={onDeleteNotify}
          >
            <button type="button" className="btn-delete-notify">
              &times;
            </button>
          </div>
        </div>
        <small
          style={{ fontSize: "15px" }}
          className="text-muted d-flex justify-content-between px-2"
        >
          {moment(msg.createdAt).fromNow()}
        </small>
      </div>
    </div>
  );
}

export default NotifyModal;

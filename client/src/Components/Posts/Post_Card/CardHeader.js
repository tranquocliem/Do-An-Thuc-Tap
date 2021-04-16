import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import moment from "moment";
import "moment/locale/vi";
import { AuthContext } from "../../../Context/AuthContext";

function CardHeader(props) {
  const { user } = useContext(AuthContext);
  return (
    <div className="card_header">
      <div className="d-flex">
        <Avatar user={props.post.writer} size="big-avatar" />
        <div className="card-name">
          <h6 className="m-0">
            <Link to={`/profile/${props.post.writer.username}`}>
              {props.post.writer.username}
            </Link>
          </h6>
          <small className="text-muted no-select">
            {`${moment(props.post.createdAt).fromNow()} (${moment(
              props.post.createdAt
            ).format("L")})`}
          </small>
        </div>
      </div>
      <div className="nav-item dropdown">
        <i
          className="fas fa-ellipsis-h"
          id="moreLink"
          data-toggle="dropdown"
        ></i>
        <div className="dropdown-menu">
          {user._id === props.post.writer._id && (
            <>
              <div className="dropdown-item no-select">
                <i className="fas fa-edit"></i> Chỉnh sửa
              </div>
              <div className="dropdown-item no-select">
                <i className="fas fa-trash-alt"></i> Xoá bài viết
              </div>
            </>
          )}
          <div className="dropdown-item no-select">
            <i className="fas fa-copy"></i> Sao chép
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardHeader;

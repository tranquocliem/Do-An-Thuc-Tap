import React, { useEffect, useState } from "react";
import { follow, getFollowers, unFollow } from "../../Service/FollowService";
import { MyToast } from "../Toastify/toast";
import Toastify from "../Toastify/Toastify";

function FollowBtn(props) {
  const [btnFollow, setBtnFollow] = useState(false);
  const [pendingBtn, setPendingBtn] = useState(false);

  useEffect(() => {
    const variable = {
      id: props.user._id,
    };
    getFollowers(variable).then((data) => {
      if (data.success) {
        setPendingBtn(true);
        data.follow.map((fl) => {
          if (fl.following._id === props.myUser._id) {
            return setBtnFollow(true);
          }
          return null;
        });
      }
    });
  }, [props.user._id, props.myUser._id]);

  const onFollowAndUnFollow = () => {
    if (!btnFollow) {
      const variable = {
        followers: props.user._id,
      };
      follow(variable).then((data) => {
        if (data.success) {
          setBtnFollow(!btnFollow);
          props.onFollowAndUnFollow();
          MyToast("succ", `Đã theo dõi ${props.user.username}`);
        } else {
          MyToast("err", `Lỗi!!!`);
        }
      });
    } else {
      const variable = {
        followers: props.user._id,
      };
      unFollow(variable).then((data) => {
        if (data.success) {
          setBtnFollow(!btnFollow);
          props.onFollowAndUnFollow();
          MyToast("err", `Đã bỏ theo dõi ${props.user.username}`);
        } else {
          MyToast("err", `Lỗi!!!`);
        }
      });
    }
  };

  if (pendingBtn) {
    return (
      <>
        <Toastify autoClose={2000} pauseOnHover={false} closeOnClick={false} />
        {btnFollow ? (
          <button
            onClick={onFollowAndUnFollow}
            className="btn btn-danger"
            type="button"
          >
            Bỏ theo dõi
          </button>
        ) : (
          <button
            onClick={onFollowAndUnFollow}
            className="btn btn-primary"
            type="button"
          >
            Theo dõi
          </button>
        )}
      </>
    );
  } else {
    return (
      <button
        disabled
        onClick={onFollowAndUnFollow}
        className="btn btn-dark"
        type="button"
      >
        ........
      </button>
    );
  }
}

export default FollowBtn;

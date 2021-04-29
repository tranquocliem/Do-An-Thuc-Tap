import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { follow, getFollowers, unFollow } from "../../Service/FollowService";
import { createNotify } from "../../Service/NotifyService";
import { MyToast } from "../Toastify/toast";

function FollowBtn(props) {
  const [btnFollow, setBtnFollow] = useState(false);
  const [pendingBtn, setPendingBtn] = useState(false);
  const { user, socket } = useContext(AuthContext);

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

  const onFollowAndUnFollow = async () => {
    if (!btnFollow) {
      const variable = {
        followers: props.user._id,
      };
      const data = await follow(variable, socket, props.user._id);
      const msg = {
        text: "đã theo dõi bạn.",
        sender: user._id,
        receiver: props.user._id,
        url: `/profile/${user.username}/`,
      };
      await createNotify(msg, socket, user);
      if (data.success) {
        setBtnFollow(!btnFollow);
        props.onFollowAndUnFollow();
        MyToast("succ", `Đã theo dõi ${props.user.username}`);
      } else {
        MyToast("err", `Có lỗi, thử lại sau!!!`);
      }
    } else {
      const variable = {
        followers: props.user._id,
      };
      const data = await unFollow(variable, socket, props.user._id);
      if (data.success) {
        setBtnFollow();
        props.onFollowAndUnFollow(!btnFollow);
        MyToast("err", `Đã bỏ theo dõi ${props.user.username}`);
      } else {
        MyToast("err", `Có lỗi, thử lại sau!!!`);
      }
    }
  };

  if (pendingBtn) {
    return (
      <>
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

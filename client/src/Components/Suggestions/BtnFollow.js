import React, { useState } from "react";

function BtnFollow(props) {
  const [btnFollow, setBtnFollow] = useState(false);

  const idUser = props.user._id;
  const username = props.user.username;

  const onFollowAndUnFollow = () => {
    setBtnFollow(!btnFollow);
    props.onFollowAndUnFollow(idUser, !btnFollow, username);
  };

  return (
    <button
      onClick={onFollowAndUnFollow}
      type="button"
      disabled={props.disableBtn ? true : false}
      className={`btn ${btnFollow ? "btn-danger" : "btn-info"} btnFollow`}
    >
      {btnFollow ? "Bỏ theo dõi" : "Theo dõi"}
    </button>
  );
}

export default BtnFollow;

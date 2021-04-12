import React, { useState } from "react";

function FollowBtn(props) {
  const [btnFollow, setBtnFollow] = useState(false);

  const onFollowAndUnFollow = () => {
    setBtnFollow(!btnFollow);
    props.onFollowAndUnFollow(!btnFollow);
  };

  return btnFollow ? (
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
  );
}

export default FollowBtn;

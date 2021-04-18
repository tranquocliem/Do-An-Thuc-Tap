import React, { useState } from "react";

function BtnFollow(props) {
  const [btnFollow, setBtnFollow] = useState(false);

  const onFollow = () => {
    setBtnFollow(!btnFollow);
    props.onFollow();
  };

  return (
    <button
      onClick={onFollow}
      type="button"
      className={`btn ${btnFollow ? "btn-danger" : "btn-info"} btnFollow`}
    >
      {btnFollow ? "Bỏ theo dõi" : "Theo dõi"}
    </button>
  );
}

export default BtnFollow;

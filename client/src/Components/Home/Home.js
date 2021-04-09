import React from "react";
import MyHelmet from "../Helmet/MyHelmet";

function Home(props) {
  return (
    <>
      <MyHelmet
        title="𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵 - Trang Chủ"
        description="Trang mạng xã hội chia sẽ hình ảnh"
      />
      <div style={{ fontSize: "5rem" }}>Home</div>
    </>
  );
}

export default Home;

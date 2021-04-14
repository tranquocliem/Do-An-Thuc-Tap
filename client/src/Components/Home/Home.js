import React from "react";
import MyHelmet from "../Helmet/MyHelmet";
import Posts from "../Posts/Posts";
import Status from "../Status/Status";
import "./home.css";

function Home(props) {
  return (
    <>
      <MyHelmet
        title="𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵 - Trang Chủ"
        description="Trang mạng xã hội chia sẽ hình ảnh"
      />
      <div className="container">
        <div className="row home mx-0">
          <div className="col-md-8">
            <Status />
            <Posts />
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    </>
  );
}

export default Home;

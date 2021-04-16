import React from "react";
import "./posts.css";
import CardBody from "./Post_Card/CardBody";
import CardFooter from "./Post_Card/CardFooter";
import CardHeader from "./Post_Card/CardHeader";

function Posts(props) {
  return (
    <div className="post">
      {props.posts &&
        props.posts.map((post) => (
          <div key={post._id} className="card my-3">
            <CardHeader post={post} />
            <CardBody post={post} />
            <CardFooter post={post} />
          </div>
        ))}
    </div>
  );
}

export default Posts;

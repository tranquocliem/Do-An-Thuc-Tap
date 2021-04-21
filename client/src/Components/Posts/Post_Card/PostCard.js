import React from "react";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";

function PostCard({ post, user }) {
  return (
    <>
      <CardHeader post={post} />
      <CardBody post={post} />
      <CardFooter post={post} user={user} />
    </>
  );
}

export default PostCard;

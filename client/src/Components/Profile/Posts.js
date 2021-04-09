import React from "react";

// import { Container } from './styles';

function Posts(props) {
  return (
    <>
      <div>
        <h2>Post {props.user.username}</h2>
      </div>
    </>
  );
}

export default Posts;

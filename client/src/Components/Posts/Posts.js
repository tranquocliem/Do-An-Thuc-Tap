import React from "react";
import Suggestions from "../Suggestions/Suggestions";
import "./posts.css";
import CardBody from "./Post_Card/CardBody";
import CardFooter from "./Post_Card/CardFooter";
import CardHeader from "./Post_Card/CardHeader";
import Comments from "./Comments";
import InputComment from "./InputComment";

function Posts(props) {
  return (
    <div className="post">
      {props.posts &&
        props.posts.map((post, i) => (
          <div key={post._id}>
            <div className="card my-3">
              <CardHeader post={post} />
              <CardBody post={post} />
              <CardFooter post={post} user={props.user} />

              <Comments post={post} user={props.user} />
              <InputComment post={post} user={props.user} />
            </div>
            {i % 2 !== 0 && (
              <div>
                <Suggestions
                  user={props.user}
                  suggestionsUser={props.suggestionsUser}
                  loadingSuggestions={props.loadingSuggestions}
                  reLoadSuggestions={props.reLoadSuggestions}
                  onFollowAndUnFollow={props.onFollowAndUnFollow}
                  suggestions="suggestions-post"
                />
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default Posts;

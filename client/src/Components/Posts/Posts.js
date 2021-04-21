import React from "react";
import Suggestions from "../Suggestions/Suggestions";
import "./posts.css";
import Comments from "../Posts/Comments/Comments";
import PostCard from "./Post_Card/PostCard";

function Posts(props) {
  return (
    <div className="post">
      {props.posts &&
        props.posts.map((post, i) => (
          <div key={post._id}>
            <div className="card my-3">
              <PostCard post={post} user={props.user} />
              <Comments post={post} user={props.user} />
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

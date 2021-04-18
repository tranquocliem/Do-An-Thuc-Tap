import React from "react";
import "./suggestions.css";
import ListUsers from "../Header/ListUsers";
import Toastify from "../Toastify/Toastify";
import LoadingImg from "../../img/loading.gif";
import { Link } from "react-router-dom";
import BtnFollow from "./BtnFollow";

function Suggestions(props) {
  const reLoadSuggestions = () => {
    props.reLoadSuggestions();
  };

  const onFollow = () => {
    props.onFollow();
  };

  return (
    <>
      <Toastify autoClose={2000} pauseOnHover={false} closeOnClick={false} />
      <div className="main-suggestions">
        {props.myUser && (
          <Link to={`/profile/${props.user.username}/`}>
            <ListUsers user={props.user} />
          </Link>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <h5>Gợi ý cho bạn</h5>
          <i
            className="fas fa-redo reLoadSuggestions"
            onClick={reLoadSuggestions}
          />
        </div>

        {props.loadingSuggestions ? (
          <img
            src={LoadingImg}
            alt="loading-suggestions"
            className="d-block mx-auto my-4"
          />
        ) : (
          <div className={props.suggestions}>
            {props.suggestionsUser &&
              props.suggestionsUser.map((u, i) => (
                <div key={i}>
                  <Link to={`/profile/${u.username}/`}>
                    <ListUsers user={u} />
                  </Link>
                  <BtnFollow onFollow={onFollow} />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Suggestions;

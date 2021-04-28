import React from "react";
import "./suggestions.css";
import ListUsers from "../Header/ListUsers";
import LoadingImg from "../../img/loading.gif";
import BtnFollow from "./BtnFollow";

function Suggestions(props) {
  const reLoadSuggestions = () => {
    props.reLoadSuggestions();
  };

  const onFollowAndUnFollow = (idUser, btnFollow, username) => {
    props.onFollowAndUnFollow(idUser, btnFollow, username);
  };

  return (
    <>
      <div className="main-suggestions">
        {props.myUser && <ListUsers user={props.user} />}
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
                  <ListUsers user={u} />
                  <BtnFollow
                    user={u}
                    onFollowAndUnFollow={onFollowAndUnFollow}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      {props.footer && (
        <div style={{ opacity: 0.8 }} className="my-2">
          <a
            href="https://www.facebook.com/tranquocliem99/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.facebook.com/tranquocliem99/
          </a>
          <small className="d-block">
            Chào mừng bạn đến với trang website 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
          </small>
          <small>
            © 2021 INSTAGIRL FROM{" "}
            <a href="/profile/tranquocliem/" target="_blank" rel="noreferrer">
              TRẦN QUỐC LIÊM
            </a>
          </small>
        </div>
      )}
    </>
  );
}

export default Suggestions;

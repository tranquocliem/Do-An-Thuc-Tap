import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dropHeart,
  getHeartPost,
  unHeart,
} from "../../../Service/HeartService";
import ShareModal from "./ShareModal";

function CardFooter(props) {
  const [isLike, SetIsLike] = useState(false);
  const [savePost, setSavePost] = useState(false);
  const [totalHeart, setTotalHeart] = useState(0);
  const [hearts, setHearts] = useState([]);

  const postId = props.post && props.post._id;
  const userId = props.user && props.user._id;

  const [isShare, setIsShare] = useState(false);

  const fGetHeart = async (id) => {
    if (!id) return;
    const data = await getHeartPost(id);
    if (data.success) {
      setTotalHeart(data.total);
      setHearts(data.hearts);
    }
  };

  const fDropHeart = async () => {
    try {
      const variable = {
        postId,
      };
      await dropHeart(variable);
      SetIsLike(true);
      setTotalHeart(totalHeart + 1);
    } catch (error) {
      SetIsLike(true);
      setTotalHeart(totalHeart + 1);
    }
  };

  const fUnHeart = async () => {
    try {
      await unHeart(postId);
      SetIsLike(false);
      setTotalHeart(totalHeart - 1);
    } catch (error) {
      SetIsLike(false);
      setTotalHeart(totalHeart - 1);
    }
  };

  useEffect(() => {
    fGetHeart(postId);
  }, [postId]);

  useEffect(() => {
    hearts.map((h) => h.userId === userId && SetIsLike(true));
  }, [hearts, userId]);

  const dropAndUnHeart = () => {
    if (isLike) {
      fUnHeart();
    } else {
      fDropHeart();
    }
  };

  return (
    <div className="card_footer">
      <div className="card-icon-menu">
        <div>
          {!isLike ? (
            <>
              <span className="total-heart">
                {totalHeart >= 1000 ? totalHeart / 1000 + "K" : totalHeart}
              </span>
              <i onClick={dropAndUnHeart} className="far fa-heart"></i>
            </>
          ) : (
            <>
              <span className="total-heart">
                {totalHeart >= 1000 ? totalHeart / 1000 + "K" : totalHeart}
              </span>
              <i
                onClick={dropAndUnHeart}
                className="fas fa-heart text-danger"
              ></i>
            </>
          )}
          <Link
            to={`/post/${props.post && props.post._id}`}
            className="text-dark"
          >
            <i className="far fa-comment"></i>
          </Link>
          <i
            className="far fa-paper-plane"
            onClick={() => setIsShare(!isShare)}
          ></i>
        </div>
        {!savePost ? (
          <i
            title="Lưu bài viết"
            onClick={() => setSavePost(!savePost)}
            className="far fa-bookmark"
          ></i>
        ) : (
          <i
            title="Đã lưu bài viết"
            onClick={() => setSavePost(!savePost)}
            className="fas fa-bookmark text-primary"
          ></i>
        )}
      </div>
      {isShare && (
        <ShareModal url={`http://localhost:3000/post/${props.post._id}`} />
      )}
    </div>
  );
}

export default CardFooter;

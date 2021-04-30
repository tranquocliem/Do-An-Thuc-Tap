/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dropHeart,
  getHeartPost,
  unHeart,
} from "../../../Service/HeartService";
import ShareModal from "./ShareModal";
import { AuthContext } from "../../../Context/AuthContext";
import {
  createSavePost,
  deleteSavePost,
  getSavePostByPost,
} from "../../../Service/SavePostService";
import { MyToast } from "../../Toastify/toast";

function CardFooter(props) {
  const [isLike, SetIsLike] = useState(false);
  const [totalHeart, setTotalHeart] = useState(0);
  const [hearts, setHearts] = useState([]);

  const [onsavePost, setonSavePost] = useState(false);
  const [savePost, setSavePost] = useState([]);

  const { user, socket } = useContext(AuthContext);

  const postId = props.post && props.post._id;
  const userId = props.user && props.user._id;
  const writer = props.post && props.post.writer._id;

  const [isShare, setIsShare] = useState(false);

  const fGetHeart = async (id) => {
    if (!id || id !== postId) return;
    const data = await getHeartPost(id);
    if (data.success) {
      setTotalHeart(data.total);
      setHearts(data.hearts);
    }
  };

  const fGetSavePost = async (id) => {
    if (!id || id !== postId) return;
    const data = await getSavePostByPost(id);
    if (data.success) {
      setSavePost(data.savePost);
    }
  };

  const fDropHeart = async () => {
    try {
      const variable = {
        postId,
      };
      await dropHeart(variable, props.post, socket);
      SetIsLike(true);
      setTotalHeart(totalHeart + 1);
    } catch (error) {
      SetIsLike(true);
      setTotalHeart(totalHeart + 1);
    }
  };

  const fUnHeart = async () => {
    try {
      await unHeart(postId, props.post, socket);
      SetIsLike(false);
      setTotalHeart(totalHeart - 1);
    } catch (error) {
      SetIsLike(false);
      setTotalHeart(totalHeart - 1);
    }
  };

  const fCreateSavePost = async () => {
    try {
      const variable = {
        postId,
      };
      await createSavePost(variable);
      setonSavePost(true);
    } catch (error) {
      MyToast("err", "Bài viết không tồn tại hoặc gặp lỗi");
    }
  };

  const fDeleteSavePost = async () => {
    try {
      await deleteSavePost(postId);
      setonSavePost(false);
    } catch (error) {
      setonSavePost(false);
    }
  };

  useEffect(() => {
    fGetHeart(postId);
  }, [postId]);

  useEffect(() => {
    hearts.map((h) => h.userId === userId && SetIsLike(true));
  }, [hearts, userId]);

  useEffect(() => {
    fGetSavePost(postId);
  }, [postId]);

  useEffect(() => {
    savePost.map((sp) => sp.userId === userId && setonSavePost(true));
  }, [savePost, userId]);

  const dropAndUnHeart = () => {
    if (isLike) {
      fUnHeart();
    } else {
      fDropHeart();
    }
  };

  const saveAndUnSavePost = () => {
    if (onsavePost) {
      fDeleteSavePost();
    } else {
      fCreateSavePost();
    }
  };

  //Realtime DropHeart
  useEffect(() => {
    socket.on("heartPostToClient", async (postId) => {
      await fGetHeart(postId);
    });

    return () => socket.off("heartPostToClient");
  }, [socket]);

  //Realtime UnHeart
  useEffect(() => {
    socket.on("unHeartPostToClient", async (postId) => {
      fGetHeart(postId);
    });

    return () => socket.off("unHeartPostToClient");
  }, [socket]);

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
        {user._id !== writer ? (
          !onsavePost ? (
            <i
              title="Lưu bài viết"
              onClick={saveAndUnSavePost}
              className="far fa-bookmark"
            ></i>
          ) : (
            <i
              title="Đã lưu bài viết"
              onClick={saveAndUnSavePost}
              className="fas fa-bookmark text-primary"
            ></i>
          )
        ) : null}
      </div>
      {isShare && (
        <ShareModal url={`http://localhost:3000/post/${props.post._id}`} />
      )}
    </div>
  );
}

export default CardFooter;

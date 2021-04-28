import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  deletePost,
  destroyImages,
  getPostById,
  updatePost,
} from "../../../Service/PostService";
import { MyToast } from "../../Toastify/toast";
import LoadingImg from "../../../img/loading.gif";
import CardBody from "../Post_Card/CardBody";
import CardFooter from "../Post_Card/CardFooter";
import moment from "moment";
import "moment/locale/vi";
import { AuthContext } from "../../../Context/AuthContext";
import Avatar from "../../Avatar/Avatar";
import { Link } from "react-router-dom";
import { uploadImage } from "../../../Shared/CheckImage";
import Loading from "../../Loading/Loading";
import Emoji from "../../Emoji/Emoji";
import TextareaAutosize from "react-textarea-autosize";
import CommentDetail from "./CommentDetail";
import "../posts.css";
import NotFound from "../../NotFound/NotFound";

function DetailPost(props) {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [post, setPost] = useState();
  const [loadingPost, setLoadingPost] = useState(false);
  const [exist, setExist] = useState(true);

  const [onModal, setOnModal] = useState(false);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const [imagesDelete, setImagesDelete] = useState([]);

  const [camera, setCamera] = useState(false);
  const cameraRef = useRef();
  const canvasRef = useRef();
  const [tracks, setTracks] = useState("");
  const [btnStopCamera, setBtnStopCamera] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [pending, setPending] = useState(false);

  let fulln = user.fullname ? user.fullname.split(" ") : [];

  const getPost = async (id) => {
    try {
      const data = await getPostById(id);
      if (data.success) {
        setPost(data.post);
        setContent(data.post.content);
        setImages(data.post.images);
        setLoadingPost(false);
        setExist(true);
      } else {
        setExist(false);
      }
    } catch (error) {
      MyToast("err", "Có lỗi xãy ra, hoặc không tồn tại");
    }
  };

  useEffect(() => {
    setLoadingPost(true);
    // setTimeout(() => {
    //   getPost(id);
    // }, 600);
    const getPosts = async (id) => {
      try {
        const data = await getPostById(id);
        if (data.success) {
          setPost(data.post);
          setContent(data.post.content);
          setImages(data.post.images);
          setLoadingPost(false);
          setExist(true);
        } else {
          setExist(false);
        }
      } catch (error) {
        MyToast("err", "Có lỗi xãy ra, hoặc không tồn tại");
      }
    };

    return getPosts(id);
  }, [id]);

  const offOnModal = () => {
    setOnModal(!onModal);
    setShowEmoji(false);
    setCamera(false);
    if (tracks) tracks.stop();
    setTimeout(() => {
      document.testInput && document.testInput.focus();
    }, 1);
  };

  const uploadImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    if (images.length <= 11) {
      files.forEach((file) => {
        if (!file) return (err = "Hình ảnh không tồn tại");
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          return (err = "Định dạng không hổ trợ");
        }
        if (newImages.length <= 11) {
          return newImages.push(file);
        } else {
          err = "Chỉ đăng tối đa được 12 tấm hình";
        }
      });
    } else {
      err = "Chỉ đăng tối đa được 12 tấm hình";
    }

    if (images.length <= 11) {
      setImages([...images, ...newImages]);
    } else {
      err = "Chỉ đăng tối đa được 12 tấm hình";
    }

    if (err) MyToast("err", err);
  };

  const deleteImages = (i, img) => {
    const newArrImages = [...images];
    const newArrImagesDelete = [...imagesDelete];
    newArrImagesDelete.push(img.public_id);
    newArrImages.splice(i, 1);
    setImages(newArrImages);
    setImagesDelete(newArrImagesDelete);
  };

  const onCamera = () => {
    setCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaCamera) => {
          cameraRef.current.srcObject = mediaCamera;
          cameraRef.current.play();

          const track = mediaCamera.getTracks();
          setTracks(track[0]);
          setBtnStopCamera(true);
          setShowCamera(true);
        })
        .catch((err) => {});
    }
  };

  const offCamera = () => {
    tracks.stop();
    setCamera(false);
    setBtnStopCamera(false);
    setShowCamera(false);
  };

  const onCapture = () => {
    let err = "";
    const width = cameraRef.current.clientWidth;
    const height = cameraRef.current.clientHeight;

    canvasRef.current.setAttribute("width", width);
    canvasRef.current.setAttribute("height", height);
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(cameraRef.current, 0, 0, width, height);
    let URL = canvasRef.current.toDataURL();
    if (images.length <= 11) {
      setImages([...images, { camera: URL }]);
    } else {
      err = "Chỉ đăng tối đa được 12 tấm hình";
    }

    if (err) MyToast("err", err);
  };

  const reverseCamera = () => {
    setReverse(!reverse);
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setContent(content + emoji);
  };

  const onOffshowEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const resetModal = () => {
    setOnModal(false);
    setShowEmoji(false);
    setCamera(false);
    setBtnStopCamera(false);
    setShowCamera(false);
    if (tracks) tracks.stop();
  };

  const onSubmit = async () => {
    setPending(true);

    let media = [];

    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);

    if (images.length <= 0) {
      setPending(false);
      MyToast("err", "Vui lòng đăng tải một tấm ảnh");
    }
    if (
      content === post.content &&
      imgNewUrl.length === 0 &&
      imgOldUrl.length === post.images.length
    ) {
      setPending(false);
      resetModal();
    }

    if (imagesDelete.length > 0) {
      const variable = {
        public_id: imagesDelete,
      };
      destroyImages(variable);
    }

    try {
      media = await uploadImage(imgNewUrl);

      const variable = {
        content,
        images: [...imgOldUrl, ...media],
      };

      const data = await updatePost(id, variable);
      const { message } = data;
      setTimeout(() => {
        setPending(false);
        getPost(id);
        resetModal();
        MyToast("succ", `${message.msgBody}`);
      }, 1000);
    } catch (error) {
      return MyToast("err", `${error}`);
    }
  };

  const onDeletePost = async () => {
    try {
      if (window.confirm("Bạn có chắc muốn xoá bài viết")) {
        await deletePost(id);
        setLoadingPost(true);
        MyToast("succ", "Xoá bài viết thành công");
        setTimeout(() => {
          window.history.back();
        }, 1500);
      }
    } catch (error) {
      MyToast("err", "Xoá bài viết không thành công");
    }
  };

  if (exist && post !== null) {
    return (
      <>
        <div className="container">
          <div className="row home">
            <div className="col">
              {loadingPost ? (
                <img
                  src={LoadingImg}
                  alt="loading-posts"
                  className="mt-5 no-select"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              ) : (
                <div className="post">
                  <div className="card my-3 mx-auto">
                    <div className="card_header">
                      <div className="d-flex">
                        <Avatar user={post && post.writer} size="big-avatar" />
                        <div className="card-name">
                          <h6 className="m-0">
                            <Link
                              to={
                                post ? `/profile/${post.writer.username}` : "!#"
                              }
                            >
                              {post && post.writer.username}
                            </Link>
                          </h6>
                          <small className="text-muted no-select">
                            {`${moment(
                              post && post.createdAt
                            ).fromNow()} (${moment(
                              post && post.createdAt
                            ).format("L")})`}
                          </small>
                        </div>
                      </div>
                      <div className="nav-item dropdown">
                        <i
                          className="fas fa-ellipsis-h"
                          id="moreLink"
                          data-toggle="dropdown"
                        ></i>
                        <div className="dropdown-menu">
                          {post && user._id === post.writer._id && (
                            <>
                              <div
                                className="dropdown-item no-select"
                                onClick={offOnModal}
                              >
                                <i className="fas fa-edit"></i> Chỉnh sửa
                              </div>
                              <div
                                className="dropdown-item no-select"
                                onClick={onDeletePost}
                              >
                                <i className="fas fa-trash-alt"></i> Xoá bài
                                viết
                              </div>
                            </>
                          )}
                          <div className="dropdown-item no-select">
                            <i className="fas fa-copy"></i> Sao chép
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardBody post={post} />
                    <CardFooter post={post} user={user} />
                    <CommentDetail post={post} postId={id} user={user} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="bg-light text-center text-lg-start mb-5"></footer>

        <div
          className="pending no-select"
          style={pending ? { display: "flex" } : { display: "none" }}
        >
          <div className="spinner-loading font-weight-bold">
            <Loading bg="none" />
          </div>
        </div>

        {/* Modal Edit */}
        <div>
          {onModal ? (
            <div className="my-show" onClick={offOnModal}></div>
          ) : null}
          <div
            className="my-modal"
            style={!onModal ? { display: "none", overflow: "hidden" } : null}
          >
            <div className="modal-dialog my-3">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-center">
                  <h5
                    className="modal-title font-weight-bold"
                    id="exampleModalLabel"
                  >
                    Cập nhật bài viết
                  </h5>
                </div>
                <button
                  className="btn btn-dark close-status btn-floating"
                  onClick={offOnModal}
                >
                  X
                </button>
                <div className="modal-body">
                  <form>
                    <div className="form-group no-select">
                      <TextareaAutosize
                        ref={(textarea) => {
                          document.testInput = textarea;
                        }}
                        minRows="2"
                        maxRows="4"
                        className="textarea-content w-100"
                        id="content"
                        name="content"
                        spellCheck="false"
                        placeholder={`${
                          fulln[fulln.length - 1]
                        } ơi, bạn đang nghĩ gì thế?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <span
                        className="show-emoji"
                        role="img"
                        aria-labelledby=""
                        onClick={onOffshowEmoji}
                      >
                        😊
                      </span>
                    </div>

                    {showEmoji && <Emoji addEmoji={addEmoji} />}

                    <div className="form-group show-images">
                      {images.map((img, i) => (
                        <div key={i} id="file-img">
                          <img
                            className="img-thumbnail no-select"
                            src={
                              img.camera
                                ? img.camera
                                : img.url
                                ? img.url
                                : URL.createObjectURL(img)
                            }
                            alt="images"
                          />
                          <span
                            className="no-select"
                            onClick={() => deleteImages(i, img)}
                          >
                            <p>&times;</p>
                          </span>
                        </div>
                      ))}
                    </div>

                    {camera && (
                      <div className="camera position-relative">
                        {!showCamera && (
                          <img
                            src={LoadingImg}
                            alt="loading-camera"
                            className="d-block mx-auto mt-2"
                          />
                        )}
                        <video
                          style={{
                            transform: !reverse ? "scalex(1)" : "scalex(-1)",
                          }}
                          src=""
                          autoPlay
                          muted
                          ref={cameraRef}
                          width="100%"
                          height="100%"
                          className="mt-2"
                        />
                        <canvas
                          ref={canvasRef}
                          style={{
                            display: "none",
                            transform: !reverse ? "scalex(1)" : "scalex(-1)",
                          }}
                        />
                        {btnStopCamera && (
                          <span onClick={offCamera}>&times;</span>
                        )}
                      </div>
                    )}

                    <div className="input-images form-group mt-3">
                      {camera ? (
                        <>
                          <i
                            className="fas fa-camera no-select"
                            onClick={onCapture}
                          />
                          <i
                            style={{
                              transform: reverse ? "scalex(1)" : "scalex(-1)",
                            }}
                            className="fas fa-redo-alt no-select"
                            onClick={reverseCamera}
                          ></i>
                        </>
                      ) : (
                        <>
                          <i
                            className="fas fa-camera no-select"
                            onClick={onCamera}
                          />
                          <div className="file-upload">
                            <i className="fas fa-image" />
                            <input
                              className="no-select"
                              type="file"
                              name="file"
                              id="file"
                              multiple
                              accept="image/*"
                              onChange={uploadImages}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={onSubmit}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <NotFound />
      </>
    );
  }
}

export default DetailPost;

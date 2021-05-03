import React, { useContext, useRef, useState } from "react";
import "./status.css";
import Avatar from "../Avatar/Avatar";
import { AuthContext } from "../../Context/AuthContext";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import { MyToast } from "../Toastify/toast";
import "react-toastify/dist/ReactToastify.css";
import LoadingImg from "../../img/loading.gif";
import { createPost } from "../../Service/PostService";
import Loading from "../Loading/Loading";
import { uploadImage } from "../../Shared/CheckImage";
import Emoji from "../Emoji/Emoji";
import { createNotify } from "../../Service/NotifyService";
import { isAuthenticated } from "../../Service/AccountService";

function Status(props) {
  const { user, socket } = useContext(AuthContext);

  const [onModal, setOnModal] = useState(false);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const [camera, setCamera] = useState(false);
  const cameraRef = useRef();
  const canvasRef = useRef();
  const [tracks, setTracks] = useState("");
  const [btnStopCamera, setBtnStopCamera] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [pending, setPending] = useState(false);

  let fulln = user.fullname ? user.fullname.split(" ") : [];

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

    if (images.length <= 111) {
      files.forEach((file) => {
        if (!file) return (err = "Hình ảnh không tồn tại");
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "video/mp4"
        ) {
          return (err = "Định dạng không hổ trợ");
        }
        if (file.size > 1024 * 1024 * 25) {
          return (err = "File tải lên quá lớn");
        }
        if (newImages.length <= 111) {
          return newImages.push(file);
        } else {
          err = "Chỉ đăng tối đa được 12 tấm hình";
        }
      });
    } else {
      err = "Chỉ đăng tối đa được 12 tấm hình";
    }

    if (images.length <= 111) {
      setImages([...images, ...newImages]);
    } else {
      err = "Chỉ đăng tối đa được 12 tấm hình";
    }

    if (err) MyToast("err", err);
  };

  const deleteImages = (i) => {
    const newArrImages = [...images];
    newArrImages.splice(i, 1);
    setImages(newArrImages);
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
    if (images.length <= 111) {
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
    setContent("");
    setImages([]);
    setShowEmoji(false);
    setCamera(false);
    setBtnStopCamera(false);
    setShowCamera(false);
    if (tracks) tracks.stop();
  };

  const onSubmit = async () => {
    let media = [];
    if (images.length <= 0) {
      return MyToast("err", "Vui lòng đăng tải một tấm ảnh");
    }
    setPending(true);
    try {
      media = await uploadImage(images);
      const variable = {
        content,
        images: media,
      };

      const data = await createPost(variable);

      const myUser = await isAuthenticated();

      if (myUser.user.followers.length > 0) {
        const msg = {
          id: data.post._id,
          text: "có một bài viết mới.",
          receiver: myUser.user.followers,
          url: `/post/${data.post._id}`,
          content,
          image: media[0].url,
        };

        await await createNotify(msg, socket, user);
      }

      const { message } = data;
      MyToast("succ", `${message.msgBody}`);
      setPending(false);
      resetModal();
      props.reloadPost();
    } catch (error) {
      return MyToast("err", `${error}`);
    }
  };

  // const showImage = (src) => {
  //   return <img className="img-thumbnail no-select" src={src} alt="images" />;
  // };

  // const showVideo = (src) => {
  //   return (
  //     <video
  //       controls
  //       className="img-thumbnail no-select"
  //       src={src}
  //       alt="images"
  //     />
  //   );
  // };

  return (
    <>
      <div
        className="pending no-select"
        style={pending ? { display: "flex" } : { display: "none" }}
      >
        <div className="spinner-loading font-weight-bold">
          <Loading bg="none" />
        </div>
      </div>
      <div className="status my-3 d-flex no-select">
        <Link to={`/profile/${user.username}`}>
          <Avatar user={user} size="big-avatar" />
        </Link>
        <button
          onClick={offOnModal}
          className="status-Btn flex-fill text-truncate"
        >
          {!content
            ? `${fulln[fulln.length - 1]} ơi, bạn đang nghĩ gì thế?`
            : content}
        </button>
      </div>
      <div>
        {onModal ? <div className="my-show" onClick={offOnModal}></div> : null}
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
                  Tạo bài viết
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
                        {/* {img.camera ? (
                          showImage(img.camera)
                        ) : (
                          <>
                            {img.type.match(/video/i)
                              ? showVideo(URL.createObjectURL(img))
                              : showImage(URL.createObjectURL(img))}
                          </>
                        )} */}
                        <img
                          className="img-thumbnail no-select"
                          src={
                            img.camera ? img.camera : URL.createObjectURL(img)
                          }
                          alt="images"
                        />
                        <span
                          className="no-select"
                          onClick={() => deleteImages(i)}
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
                            accept="image/*, video/*"
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
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Status;

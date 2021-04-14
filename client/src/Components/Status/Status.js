import React, { useContext, useRef, useState } from "react";
import "./status.css";
import Avatar from "../Avatar/Avatar";
import { AuthContext } from "../../Context/AuthContext";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import Toastify from "../Toastify/Toastify";
import { MyToast } from "../Toastify/toast";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../img/loading.gif";

function Status() {
  const { user } = useContext(AuthContext);

  const [onModal, setOnModal] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const [camera, setCamera] = useState(false);
  const cameraRef = useRef();
  const canvasRef = useRef();
  const [tracks, setTracks] = useState("");
  const [btnStopCamera, setBtnStopCamera] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  let fulln = user.fullname ? user.fullname.split(" ") : [];

  const offOnModal = () => {
    setOnModal(!onModal);
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
        .catch((err) => {
          console.log(err);
        });
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

  return (
    <>
      <Toastify autoClose={2000} pauseOnHover={false} closeOnClick={false} />
      <div className="status my-3 d-flex">
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
                  <div className="form-group">
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
                  </div>

                  <div className="form-group show-images">
                    {images.map((img, i) => (
                      <div key={i} id="file-img">
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
                          src={Loading}
                          alt="loading-camera"
                          className="d-block mx-auto"
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
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />
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
                  disabled
                  className="btn btn-dark w-100"
                  onClick={offOnModal}
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

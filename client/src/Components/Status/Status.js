import React, { useContext, useState } from "react";
import "./status.css";
import Avatar from "../Avatar/Avatar";
import { AuthContext } from "../../Context/AuthContext";
import TextareaAutosize from "react-textarea-autosize";

function Status() {
  const { user } = useContext(AuthContext);
  const [onModal, setOnModal] = useState(false);
  const [content, setContent] = useState("");

  let fulln = user.fullname ? user.fullname.split(" ") : [];

  const offOnModal = () => {
    setOnModal(!onModal);
    setTimeout(() => {
      document.testInput && document.testInput.focus();
    }, 1);
  };

  return (
    <>
      <div className="status my-3 d-flex">
        <Avatar user={user} size="big-avatar" />
        <button onClick={offOnModal} className="status-Btn flex-fill">
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
          <div className="modal-dialog modal-translate">
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
                      minRows="4"
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
                  <div className="input-images form-group mt-5">
                    <i className="fas fa-camera" />
                    <div className="file-upload">
                      <i className="fas fa-image" />
                      <input
                        type="file"
                        name="file"
                        id="file"
                        multiple
                        accept="image/*"
                      />
                    </div>
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

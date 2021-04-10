import React, { useEffect, useState } from "react";
import { checkImage } from "../../Shared/CheckImage";
import Toastify from "../Toastify/Toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfile(props) {
  const [userData, setUserData] = useState({
    fullname: "",
    phone: "",
    website: "",
    story: "",
    gender: "",
  });

  useEffect(() => {
    setUserData(props.user);
  }, [props.user]);

  console.log(userData);

  const [avatar, setAvatar] = useState("");

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImage(file);
    if (err) {
      return toast.error(`🚀 ${err}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setAvatar(file);
  };

  const onChange = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <>
      <Toastify autoClose={2000} pauseOnHover={false} closeOnClick={false} />
      <div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chỉnh sửa cá nhân
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-mdb-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="info-avatar">
                    <img
                      src={
                        avatar ? URL.createObjectURL(avatar) : props.user.avatar
                      }
                      alt="avatar"
                    />
                    <span>
                      <i className="fas fa-camera"></i>
                      <p>Thay đổi</p>
                      <input
                        type="file"
                        name="file"
                        id="file-up"
                        accept="image/*"
                        onChange={changeAvatar}
                      />
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <div className="position-relative">
                        <label htmlFor="fullname">Họ và tên</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullname"
                          name="fullname"
                          value={userData.fullname}
                          onChange={onChange}
                          spellCheck="false"
                        />
                        <small
                          style={{
                            top: "72%",
                            right: "5px",
                            transform: "translateY(-50%)",
                          }}
                          className="text-danger position-absolute"
                        >
                          {userData.fullname.length}/35
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={onChange}
                        spellCheck="false"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label htmlFor="website">Trang Web</label>
                      <input
                        type="text"
                        className="form-control"
                        id="website"
                        name="website"
                        value={userData.website}
                        onChange={onChange}
                        spellCheck="false"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label htmlFor="story">Tiểu sử</label>
                      <textarea
                        cols="30"
                        rows="4"
                        className="form-control"
                        id="story"
                        name="story"
                        value={userData.story}
                        onChange={onChange}
                        spellCheck="false"
                      />
                      <small
                        style={{ textAlign: "right" }}
                        className="text-danger d-block text-end"
                      >
                        {userData.story.length}/200
                      </small>
                    </div>
                  </div>
                  <label htmlFor="gender">Giới tính</label>
                  <div className="input-group-prepend px-0 mb-4">
                    <select
                      name="gender"
                      id="gender"
                      className="custom-select text-capitalize"
                      onChange={onChange}
                    >
                      {userData.gender === "Nam" ? (
                        <option value="Nam" selected>
                          Nam
                        </option>
                      ) : (
                        <option value="Nam">Nam</option>
                      )}
                      {userData.gender === "Nữ" ? (
                        <option value="Nữ" selected>
                          Nữ
                        </option>
                      ) : (
                        <option value="Nữ">Nữ</option>
                      )}
                      {userData.gender === "Không muốn tiết lộ" ? (
                        <option value="Không muốn tiết lộ" selected>
                          Không muốn tiết lộ
                        </option>
                      ) : (
                        <option value="Không muốn tiết lộ">
                          Không muốn tiết lộ
                        </option>
                      )}
                      <option value="Không muốn tiết lộ">
                        Không muốn tiết lộ
                      </option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-mdb-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;

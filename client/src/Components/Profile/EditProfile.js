import React, { useEffect, useState } from "react";
import { checkImage, uploadImage } from "../../Shared/CheckImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyToast } from "../Toastify/toast";
import Loading from "../Loading/Loading";
import { destroyAvatar, updateUser } from "../../Service/AccountService";

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

  const [avatar, setAvatar] = useState("");
  const [pending, setPending] = useState(false);

  const offModal = () => {
    props.offModal();
    setUserData(props.user);
    setAvatar("");
  };

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

  const updateProfile = async (id) => {
    if (!userData.fullname) {
      return MyToast("err", "Không bỏ trống họ và tên");
    } else if (userData.fullname.length > 35) {
      return MyToast("err", "Họ và tên quá dài");
    } else if (userData.story.length > 200) {
      return MyToast("err", "Tiểu sử dài quá");
    }
    try {
      let media;
      setPending(true);
      if (avatar) {
        await destroyAvatar();
        media = await uploadImage([avatar]);
      }
      const variable = {
        fullname: userData.fullname,
        phone: userData.phone,
        website: userData.website,
        story: userData.story,
        gender: userData.gender,
        avatar: avatar ? media[0].url : props.user.avatar,
        public_id: avatar ? media[0].public_id : 0,
      };
      const data = await updateUser(variable);
      const { message } = data;
      setTimeout(
        () => {
          if (message.msgError) {
            MyToast("err", `${message.msgBody}`);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
          props.updateProfile(id);
          MyToast("succ", `${message.msgBody}`);
          setPending(false);
        },
        avatar ? 1000 : 2000
      );
    } catch (error) {
      return MyToast("err", `${error}`);
    }
  };
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
      <div>
        {props.onModal ? (
          <div className="my-show" onClick={offModal}></div>
        ) : null}
        <div
          className="my-modal"
          style={
            !props.onModal ? { display: "none", overflow: "hidden" } : null
          }
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chỉnh sửa cá nhân
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={offModal}
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
                        title="Thay đổi ảnh"
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
                      value={userData.gender}
                    >
                      <option value="Nam">Nam</option>

                      <option value="Nữ">Nữ</option>

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
                  onClick={offModal}
                >
                  Tắt
                </button>
                <button
                  onClick={updateProfile}
                  type="submit"
                  className="btn btn-primary"
                >
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

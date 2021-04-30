import React, { useState } from "react";
import { changePass, logout } from "../../Service/AccountService";
import { MyToast } from "../Toastify/toast";
import "./changepass.css";

function ChangePass(props) {
  const [userData, setUserData] = useState({
    old_Password: "",
    password: "",
    configPassword: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      userData.old_Password !== "" &&
      userData.password !== "" &&
      userData.password.length + 1 > 6
    ) {
      const data = await changePass(userData);

      const { message } = data;

      if (!message.msgError) {
        MyToast("succ", `${message.msgBody}. Đăng xuất sau 2 giây`);

        setTimeout(async () => {
          await logout();
          window.location.reload();
        }, 2100);
      } else {
        MyToast("err", `${message.msgBody}`);
      }
    } else {
      MyToast("err", "Vui lòng không bỏ trống. Mật khẩu mới 6 ký tự trở lên");
    }
  };

  return (
    <>
      <div className="change-pass">
        <form onSubmit={onSubmit} className="change-pass-form">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1"></label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Nhập mật khẩu củ"
              name="old_Password"
              value={userData.old_Password}
              onChange={onChangeInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1"></label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              placeholder="Nhập mật khẩu mới"
              name="password"
              value={userData.password}
              onChange={onChangeInput}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword2"></label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword3"
              placeholder="Nhập lại mật khẩu mới"
              name="configPassword"
              value={userData.configPassword}
              onChange={onChangeInput}
            />
          </div>
          <button type="submit" className="w-100 mt-3 btn btn-primary">
            Đổi Mật Khẩu
          </button>
        </form>
      </div>
    </>
  );
}

export default ChangePass;

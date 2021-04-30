import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPass } from "../../Service/AccountService";
import MyHelmet from "../Helmet/MyHelmet";
import { MyToast } from "../Toastify/toast";
import NotifyForget from "./NotifyForget";

function Forget() {
  const [valiem, setValiEm] = useState(true);
  const [valiEmail, setValiEmail] = useState(true);
  const [email, setEmail] = useState("");

  const [notifyForget, setNotifyForget] = useState(false);

  const Reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const onSubmit = async (e) => {
    const testEmail = new RegExp(Reg).test(email);
    e.preventDefault();
    if (testEmail && email !== "") {
      setValiEmail(true);
      setValiEm(true);
      const data = await forgetPass({ email });

      const { message } = data;

      if (!message.msgError) {
        MyToast("succ", `${message.msgBody}`);

        setTimeout(() => {
          setNotifyForget(true);
        }, 500);
      } else {
        MyToast("err", `${message.msgBody}`);
      }
    } else {
      if (!testEmail) {
        setValiEmail(false);
      } else {
        setValiEmail(true);
      }
      if (email === "") {
        setValiEm(false);
      } else {
        setValiEm(true);
      }
    }
  };

  return (
    <>
      <MyHelmet
        title="Quên Mật Khẩu"
        description="Bạn đã quên mật khẩu trong khi sử dụng 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵"
      />
      {notifyForget ? (
        <NotifyForget />
      ) : (
        <div className="login-page">
          <form onSubmit={onSubmit}>
            <h1 className="text-logo no-select text-uppercase text-center mb-3">
              𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
            </h1>
            <div
              className={
                !valiem || !valiEmail ? "form-group" : "form-group pd-top"
              }
            >
              <label
                htmlFor="exampleInputEmail1"
                className={!valiem || !valiEmail ? "onVali mt-2" : "offVali"}
              >
                <i className="fa fa-times-circle" aria-hidden="true"></i> Không
                được bỏ trống và Email hợp lệ
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Nhập email"
                spellCheck="false"
              />
            </div>
            <button type="submit" className="mt-4 btn w-100 mb-3">
              Lấy Lại Mật Khẩu
            </button>
            <p className="my-2">
              Bạn có tài khoản chưa?{" "}
              <Link to="/register" style={{ color: "rgb(41, 37, 37)" }}>
                Đăng ký
              </Link>
            </p>
            <p className="my-2">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" style={{ color: "rgb(41, 37, 37)" }}>
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default Forget;

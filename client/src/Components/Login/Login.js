import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../Service/AccountService";
import { toast } from "react-toastify";
import "./login.css";
import MyHelmet from "../Helmet/MyHelmet";

function Login(props) {
  const [userData, setUserData] = useState({ username: "", password: "" });

  const [valiUs, setValiUs] = useState(true);
  const [valiPass, setValiPass] = useState(true);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const resetForm = () => {
    setUserData({
      username: "",
      password: "",
    });
    setValiUs(true);
    setValiPass(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (userData.username !== "" && userData.password !== "") {
      setValiUs(true);
      setValiPass(true);
      login(userData).then((data) => {
        const { message } = data;
        if (!message.msgError) {
          resetForm();
          window.location.reload();
        } else {
          toast.error(`🚀 ${message.msgBody}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
    } else {
      if (userData.username === "") {
        setValiUs(false);
      } else {
        setValiUs(true);
      }
      if (userData.password === "") {
        setValiPass(false);
      } else {
        setValiPass(true);
      }
    }
  };

  return (
    <>
      <MyHelmet
        title="Đăng Nhập"
        description="Đăng nhập để có thể sử dụng các chức năng của 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵"
      />
      <div className="login-page">
        <form>
          <h1 className="text-logo no-select text-uppercase text-center mb-3">
            𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
          </h1>
          <div className={!valiUs ? "form-group" : "form-group pd-bt"}>
            <label
              htmlFor="exampleInputEmail1"
              className={!valiUs ? "onVali mb-1" : "offVali"}
            >
              <i className="fa fa-times-circle" aria-hidden="true"></i> Không
              được bỏ trống
            </label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={onChangeInput}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Username hoặc email"
              spellCheck="false"
            />
          </div>
          <div className={!valiPass ? "form-group" : "form-group pd-top"}>
            <label
              htmlFor="exampleInputPassword1"
              className={!valiPass ? "onVali mb-1" : "offVali"}
            >
              <i className="fa fa-times-circle" aria-hidden="true"></i> Không
              được bỏ trống
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={onChangeInput}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="mt-4 btn w-100 mb-3"
            onClick={onSubmit}
          >
            Đăng Nhập
          </button>
          <p className="my-2">
            Bạn có tài khoản chưa?{" "}
            <Link to="/register" style={{ color: "rgb(41, 37, 37)" }}>
              Đăng ký
            </Link>
          </p>
          <p className="my-2">
            Bạn đã quên mật khẩu?{" "}
            <Link to="/forget" style={{ color: "rgb(41, 37, 37)" }}>
              Forget
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;

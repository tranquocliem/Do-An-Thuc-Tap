import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../Service/AccountService";
import { toast } from "react-toastify";
import "./login.css";
import MyHelmet from "../Helmet/MyHelmet";
import CryptoJS from "crypto-js";
import { MyToast } from "../Toastify/toast";

const KEY =
  ".FOQJcVH^*w5uH[6Xit)|m0VO<RnHS2ON)>Ce.>3oERf~=AOE7-*l$/MwM+22j=tranquocliem";

function Login(props) {
  const [userData, setUserData] = useState({ username: "", password: "" });

  const [valiUs, setValiUs] = useState(true);
  const [valiPass, setValiPass] = useState(true);

  const [btnPending, setBtnPending] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(false);

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

  const encrypt = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      KEY
    ).toString();
    return ciphertext;
  };

  const decrypt = (encrypted) => {
    try {
      var bytes = CryptoJS.AES.decrypt(encrypted, KEY);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      toast.error(`🚀 Error`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setPendingLogin(true);

      const userDT = decrypt(localStorage.getItem("user"));

      const autoLogin = async () => {
        const data = await login(userDT);
        const { message } = data;
        if (!message.msgError) {
          resetForm();
          window.location.reload();
        } else {
          setPendingLogin(false);
          MyToast("err", `${message.msgBody}`);
        }
      };

      return autoLogin();
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userData.username !== "" && userData.password !== "") {
      setValiUs(true);
      setValiPass(true);
      setBtnPending(true);

      const data = await login(userData);

      setBtnPending(false);

      const { message } = data;

      if (!message.msgError) {
        resetForm();
        const en = encrypt(userData);
        localStorage.setItem("user", en);
        window.location.reload();
      } else {
        MyToast("err", `${message.msgBody}`);
      }
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
        {pendingLogin ? (
          <form className="text-center">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </form>
        ) : (
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
            {btnPending ? (
              <button
                type="button"
                className="btn btn-primary mt-4 btn w-100 mb-3"
                disabled
              >
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Loading...</span>
              </button>
            ) : (
              <button
                type="submit"
                className="mt-4 btn w-100 mb-3"
                onClick={onSubmit}
              >
                Đăng Nhập
              </button>
            )}

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
        )}
      </div>
    </>
  );
}

export default Login;

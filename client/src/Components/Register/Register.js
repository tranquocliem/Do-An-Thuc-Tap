import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../Service/AccountService";
import "./register.css";
import { MyToast } from "../Toastify/toast";
import NotifyRegister from "./NotifyRegister";
import MyHelmet from "../Helmet/MyHelmet";

function Register(props) {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    configpassword: "",
    gender: "Nam",
  });

  const [valiFName, setValiFName] = useState(true);
  const [valiem, setValiEm] = useState(true);
  const [valiUs, setValiUs] = useState(true);
  const [valiPass, setValiPass] = useState(true);
  const [valiPassCF, setValiPassCF] = useState(true);
  const [valiEmail, setValiEmail] = useState(true);

  const [notifyRegister, setNotifyRegister] = useState(false);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const resetForm = () => {
    setUserData({
      fullname: "",
      email: "",
      username: "",
      password: "",
      configpassword: "",
      gender: "Nam",
    });
    setValiFName(true);
    setValiEm(true);
    setValiUs(true);
    setValiPass(true);
    setValiPassCF(true);
  };

  const Reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const onSubmit = async (e) => {
    const testEmail = new RegExp(Reg).test(userData.email);
    e.preventDefault();
    if (
      testEmail &&
      userData.fullname !== "" &&
      userData.username !== "" &&
      userData.username.length + 1 > 3 &&
      userData.password !== "" &&
      userData.password.length + 1 > 6 &&
      userData.configpassword === userData.password &&
      userData.email !== "" &&
      userData.configpassword !== ""
    ) {
      setValiFName(true);
      setValiEmail(true);
      setValiUs(true);
      setValiEm(true);
      setValiPass(true);
      setValiPassCF(true);
      const data = await register(userData);

      const { message } = data;

      if (!message.msgError) {
        MyToast("succ", `${message.msgBody}`);
        resetForm();

        setTimeout(() => {
          setNotifyRegister(true);
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
      if (userData.fullname === "") {
        setValiFName(false);
      } else {
        setValiFName(true);
      }
      if (
        userData.username === "" ||
        userData.username.length < 3 ||
        userData.username.length > 25
      ) {
        setValiUs(false);
      } else {
        setValiUs(true);
      }
      if (userData.password === "" || userData.password.length < 6) {
        setValiPass(false);
      } else {
        setValiPass(true);
      }
      if (
        userData.configpassword === "" ||
        userData.configpassword !== userData.password
      ) {
        setValiPassCF(false);
      } else {
        setValiPassCF(true);
      }
      if (userData.email === "") {
        setValiEm(false);
      } else {
        setValiEm(true);
      }
    }
  };

  return (
    <>
      <MyHelmet
        title="Đăng Ký"
        description="Đăng ký để có một tài khoản để có thể sử dụng các chức năng của 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵"
      />
      {notifyRegister ? (
        <NotifyRegister />
      ) : (
        <>
          <div className="login-page">
            <form className="form-register">
              <h1 className="text-logo no-select text-uppercase text-center mb-3">
                𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
              </h1>
              <div className={!valiFName ? "form-group" : "form-group pd-bt"}>
                <label
                  htmlFor="exampleInputFullname"
                  className={!valiFName ? "onVali mb-1" : "offVali"}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>{" "}
                  Không được bỏ trống
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={userData.fullname}
                  onChange={onChangeInput}
                  className="form-control"
                  id="exampleInputFullname"
                  placeholder="Họ và tên"
                  spellCheck="false"
                />
              </div>
              <div
                className={
                  !valiem || !valiEmail ? "form-group" : "form-group pd-top"
                }
              >
                <label
                  htmlFor="exampleInputEmail1"
                  className={!valiem || !valiEmail ? "onVali mt-2" : "offVali"}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>{" "}
                  Không được bỏ trống và Email hợp lệ
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={onChangeInput}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Email"
                  spellCheck="false"
                />
              </div>
              <div className={!valiUs ? "form-group" : "form-group pd-top"}>
                <label
                  htmlFor="exampleInputUsername"
                  className={!valiUs ? "onVali mt-2" : "offVali"}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>{" "}
                  Không được bỏ trống và từ 3 đến 25 ký tự
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username.toLowerCase().replace(/ /g, "")}
                  onChange={onChangeInput}
                  className="form-control"
                  id="exampleInputUsername"
                  placeholder="Username"
                  spellCheck="false"
                />
              </div>
              <div className={!valiPass ? "form-group" : "form-group pd-top"}>
                <label
                  htmlFor="exampleInputPassword"
                  className={!valiPass ? "onVali mt-2" : "offVali"}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>{" "}
                  Không được bỏ trống và từ 6 ký tự
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={onChangeInput}
                  className="form-control"
                  id="exampleInputPassword"
                  placeholder="Nhập Mật khẩu"
                />
              </div>
              <div className={!valiPassCF ? "form-group" : "form-group pd-top"}>
                <label
                  htmlFor="exampleInputConfigPassword"
                  className={!valiPassCF ? "onVali mt-2" : "offVali"}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i> Mật
                  khẩu không khớp
                </label>
                <input
                  type="password"
                  name="configpassword"
                  value={userData.configpassword}
                  onChange={onChangeInput}
                  className="form-control"
                  id="exampleInputConfigPassword"
                  placeholder="Nhập lại Mật khẩu"
                />
              </div>
              <div className="form-group d-flex mt-4 gender justify-content-between">
                <label htmlFor="nam" className="text-select-radio">
                  Nam:{" "}
                  <input
                    type="radio"
                    onChange={onChangeInput}
                    value="Nam"
                    name="gender"
                    defaultChecked
                  />
                </label>
                <label htmlFor="nu" className="text-select-radio">
                  Nữ:{" "}
                  <input
                    type="radio"
                    onChange={onChangeInput}
                    value="Nữ"
                    name="gender"
                  />
                </label>
                <label htmlFor="khac" className="text-select-radio">
                  Khác:{" "}
                  <input
                    type="radio"
                    onChange={onChangeInput}
                    value="Không muốn tiết lộ"
                    name="gender"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 btn w-100 mb-2"
                onClick={onSubmit}
              >
                Đăng ký
              </button>
              <p className="my-2">
                Bạn đã tài khoản chưa.{" "}
                <Link to="/login" style={{ color: "rgb(41, 37, 37)" }}>
                  Đăng nhập
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
      )}
    </>
  );
}

export default Register;

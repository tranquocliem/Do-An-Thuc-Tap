import React, { useState } from "react";
import MyHelmet from "../Helmet/MyHelmet";
import { MyToast } from "../Toastify/toast";
import { resetPass } from "../../Service/AccountService";
import { useParams } from "react-router";

function ResetPass(props) {
  const [userData, setUserData] = useState({
    password: "",
    configpassword: "",
  });
  const { token } = useParams();
  const [valiPass, setValiPass] = useState(true);
  const [valiPassCF, setValiPassCF] = useState(true);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      userData.password !== "" &&
      userData.password.length + 1 > 6 &&
      userData.configpassword === userData.password &&
      userData.configpassword !== ""
    ) {
      setValiPass(true);
      setValiPassCF(true);

      const variable = {
        resetLink: token,
        newPassword: userData.password,
      };
      const data = await resetPass(variable);

      const { message } = data;

      if (!message.msgError) {
        MyToast("succ", `${message.msgBody}`);

        setTimeout(() => {
          props.history.push("/login");
        }, 500);
      } else {
        MyToast("err", `${message.msgBody}`);
      }
    } else {
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
    }
  };

  return (
    <>
      <MyHelmet
        title="Đăt Lại Mật Khẩu"
        description="Bạn đã quên mật khẩu trong khi sử dụng 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵"
      />
      <div className="login-page">
        <form onSubmit={onSubmit}>
          <h1 className="text-logo no-select text-uppercase text-center mb-3">
            𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
          </h1>
          <div className={!valiPass ? "form-group" : "form-group pd-top"}>
            <label
              htmlFor="exampleInputPassword"
              className={!valiPass ? "onVali mt-2" : "offVali"}
            >
              <i className="fa fa-times-circle" aria-hidden="true"></i> Không
              được bỏ trống và từ 6 ký tự
            </label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={onChangeInput}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className={!valiPassCF ? "form-group" : "form-group pd-top"}>
            <label
              htmlFor="exampleInputConfigPassword"
              className={!valiPassCF ? "onVali mt-2" : "offVali"}
            >
              <i className="fa fa-times-circle" aria-hidden="true"></i> Mật khẩu
              không khớp
            </label>
            <input
              type="password"
              name="configpassword"
              value={userData.configpassword}
              onChange={onChangeInput}
              className="form-control"
              id="exampleInputConfigPassword"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          <button type="submit" className="mt-4 btn w-100 mb-3">
            Đặt Lại Mật Khẩu
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPass;

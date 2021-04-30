import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { activation } from "../../Service/AccountService";

function Activate() {
  const { token } = useParams();
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    const fActivation = async (variable) => {
      try {
        const data = await activation(variable);
        if (data.success) {
          setSuccess(true);
        }
      } catch (error) {
        setSuccess(false);
      }
    };

    const variable = {
      token,
    };

    return fActivation(variable);
  }, [token]);

  return (
    <>
      <div className="login-page">
        <div className="card-notify">
          <h1 className="text-notify no-select text-uppercase text-center mb-3">
            Thông báo
          </h1>
          <h1 className="text-logo no-select text-uppercase text-center mb-3">
            𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵
          </h1>
          <div className="w-100 text-content text-center">
            {success ? (
              <p className="mb-0" style={{ fontSize: "14px", color: "green" }}>
                Chúc mừng bạn đã kích hoạt tài khoản thành công.
              </p>
            ) : (
              <p
                className="mb-0"
                style={{ fontSize: "14px", color: "crimson" }}
              >
                Kích hoạt tài khoản không thành công.
              </p>
            )}
            <small>
              Người gửi{" "}
              <a
                href="https://www.facebook.com/tranquocliem99/"
                target="_blank"
                rel="noreferrer"
              >
                TRẦN QUỐC LIÊM
              </a>
            </small>
            <br />
            <small style={{ fontSize: "10px" }}>
              © 2021 INSTAGIRL FROM{" "}
              <a
                href="https://www.facebook.com/tranquocliem99/"
                target="_blank"
                rel="noreferrer"
              >
                TRẦN QUỐC LIÊM
              </a>
            </small>
          </div>
          <Link className="text-dark" to="/login">
            <button type="submit" className="mt-4 btn w-100 mb-3 ">
              Đăng Nhập
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Activate;

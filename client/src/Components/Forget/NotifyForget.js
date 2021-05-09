import React from "react";

// import { Container } from './styles';

function NotifyForget() {
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
            <p>Vui lòng đến email của bạn để có thể đặt lại mật khẩu.</p>
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
          <a className="text-dark" href="https://mail.google.com/">
            <button type="button" className="mt-4 btn w-100 mb-3 ">
              Đến email của bạn
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

export default NotifyForget;

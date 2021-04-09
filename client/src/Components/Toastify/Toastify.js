import { ToastContainer } from "react-toastify";

import React from "react";

// import { Container } from './styles';

function Toastify(props) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={props.autoClose}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={props.closeOnClick}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={props.pauseOnHover}
    />
  );
}

export default Toastify;

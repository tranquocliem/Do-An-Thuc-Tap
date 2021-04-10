import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const MyToast = (title, message) => {
  if (title === "err") {
    return toast.error(`🚀 ${message}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } else if (title === "succ") {
    return toast.success(`🦄 ${message}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
};

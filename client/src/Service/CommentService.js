import axios from "axios";

export const createComment = (variable) => {
  return axios
    .post("/api/comment/createComment", variable)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return {
        message: {
          msgBody: "Lỗi!!!",
          msgError: true,
        },
        err,
      };
    });
};

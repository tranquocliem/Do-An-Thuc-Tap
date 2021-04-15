import axios from "axios";

export const createPost = (variable) => {
  return axios
    .post("/api/post/createPost", variable)
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

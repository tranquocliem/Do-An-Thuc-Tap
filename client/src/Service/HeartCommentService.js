import axios from "axios";

export const dropHeartComment = (variable) => {
  return axios
    .post("/api/heartcomment/dropHeartComment", variable)
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

export const unHeartComment = (commentId) => {
  return axios
    .delete(`/api/heartcomment/unHeartComment?commentId=${commentId}`)
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

export const getHeartComment = (id) => {
  return axios
    .get(`/api/heartcomment/getHeartComment?id=${id}`)
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

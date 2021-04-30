import axios from "axios";

export const createSavePost = (variable) => {
  return axios
    .post("/api/savePost/createSavePost", variable)
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

export const getSavePostByUser = (skip) => {
  return axios
    .get(`/api/savePost/getSavePostByUser?skip=${skip}`)
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

export const getSavePostByPost = (postId) => {
  return axios
    .get(`/api/savePost/getSavePostByPost?postId=${postId}`)
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

export const deleteSavePost = (postId) => {
  return axios
    .delete(`/api/savePost/deleteSavePost?postId=${postId}`)
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

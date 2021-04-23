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

export const getComment = (postId, limit) => {
  return axios
    .get(`/api/comment/getComment?postId=${postId}&limit=${limit}`)
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

export const updateComment = (commentId, content) => {
  return axios
    .patch(`/api/comment/updateComment?_id=${commentId}`, content)
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

export const deleteComment = (CommentId) => {
  return axios
    .delete(`/api/comment/deleteComment?_id=${CommentId}`)
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

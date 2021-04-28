import axios from "axios";

export const createReplyComment = (variable, socket, post) => {
  return axios
    .post("/api/replycomment/createReplyComment", variable)
    .then((res) => {
      socket.emit("createReplyComment", post, variable.reply);
      return res.data;
    });
};

export const getReplyComment = (postId, reply, limit) => {
  return axios
    .get(
      `/api/replycomment/getReplyComment?postId=${postId}&reply=${reply}&limit=${limit}`
    )
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

export const updateReplyComment = (replyCommentId, content) => {
  return axios
    .patch(
      `/api/replycomment/updateReplyComment?_id=${replyCommentId}`,
      content
    )
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

export const deleteReplyComment = (replyCommentId) => {
  return axios
    .delete(`/api/replycomment/deleteReplyComment?_id=${replyCommentId}`)
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

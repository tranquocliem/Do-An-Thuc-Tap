import axios from "axios";

export const dropHeart = (variable, post, socket) => {
  return axios
    .post("/api/heart/dropHeart", variable)
    .then((res) => {
      socket.emit("heartPost", post);
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

export const unHeart = (postId, post, socket) => {
  socket.emit("unHeartPost", post);
  return axios
    .delete(`/api/heart/unHeart?postId=${postId}`)
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

// sử dụng
export const getHeartPost = (id) => {
  return axios
    .get(`/api/heart/getHeartPost?id=${id}`)
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

export const getHeart = (id) => {
  return axios
    .get(`/api/heart/getHeart?id=${id}`)
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

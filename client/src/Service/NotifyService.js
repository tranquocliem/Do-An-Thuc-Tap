import axios from "axios";

export const createNotify = (variable, socket, user) => {
  return axios
    .post("/api/notify/createNotify", variable)
    .then((res) => {
      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          username: user.username,
          avatar: user.avatar,
        },
      });
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

export const getNotify = () => {
  return axios
    .get("/api/notify/getNotify")
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

export const deleteNotify = (id) => {
  return axios
    .delete(`/api/notify/deleteNotify?id=${id}`)
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

export const deleteAllNotify = () => {
  return axios
    .delete("/api/notify/deleteAllNotify")
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

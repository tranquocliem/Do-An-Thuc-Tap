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

export const getPost = (variable) => {
  return axios
    .post("/api/post/getPost", variable)
    .then((res) => {
      if (res.status !== 401) {
        return res.data;
      } else {
        return;
      }
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

export const getPostById = (id) => {
  return axios
    .get(`/api/post/postById?id=${id}`)
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

export const getPostByWriter = (id, skip) => {
  return axios
    .get(`/api/post/postByWriter?writer=${id}&skip=${skip}`)
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

export const getPostDiscover = (skip) => {
  return axios
    .get(`/api/post/getPostDiscover?skip=${skip}`)
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

export const updatePost = (id, variable) => {
  return axios
    .patch(`/api/post/updatePost?id=${id}`, variable)
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

export const deletePost = (id) => {
  return axios
    .delete(`/api/post/deletePost?_id=${id}`)
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

export const destroyImages = (variable) => {
  return axios
    .post("/api/post/destroyImages", variable)
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

export const upload = () => {
  return axios.post("/api/post/uploadImage").then((res) => {
    return res.data;
  });
};

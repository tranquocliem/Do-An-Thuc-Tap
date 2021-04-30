import axios from "axios";

export const register = (user) => {
  return axios
    .post("/api/account/register", user)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return {
        message: {
          msgBody: "Tạo tài khoản không thành công",
          msgError: true,
        },
        err,
      };
    });
};

export const activation = (variable) => {
  return axios.post("/api/account/activation", variable).then((response) => {
    return response.data;
  });
};

export const login = (user) => {
  return axios
    .post("/api/account/login", user)
    .then((res) => {
      if (res.status !== 401) {
        return res.data;
      } else {
        return {
          isAuthenticated: false,
          user: { username: "", role: "" },
          message: { msgBody: "Error", msgError: true },
        };
      }
    })
    .catch((err) => {
      return {
        message: {
          msgBody: "Sai tài khoản hoặc mật khẩu",
          msgError: true,
        },
      };
    });
};

export const logout = () => {
  return axios.get("/api/account/logout").then((res) => {
    return res.data;
  });
};

export const forgetPass = (variable) => {
  return axios.post("/api/account/forgetPass", variable).then((res) => {
    return res.data;
  });
};

export const resetPass = (variable) => {
  return axios.post("/api/account/resetPass", variable).then((res) => {
    return res.data;
  });
};

export const getUser = (username) => {
  return axios
    .get(`/api/account/getUser?username=${username}`)
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

export const updateUser = (variable) => {
  return axios
    .patch("/api/account/updateUser", variable)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return {
        message: {
          msgBody: "Cập nhật không thành công",
          msgError: true,
        },
        err,
      };
    });
};

export const destroyAvatar = () => {
  return axios
    .get("/api/account/destroyAvatar")
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return {
        message: {
          msgBody: "Cập nhật không thành công",
          msgError: true,
        },
        err,
      };
    });
};

export const searchUser = (username) => {
  return axios
    .get(`/api/account/searchUser?username=${username}`)
    .then((res) => {
      return res.data;
    });
};

export const suggestions = () => {
  return axios
    .get("/api/account/suggestions")
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

export const isAuthenticated = () => {
  return fetch("/api/account/authenticated").then((res) => {
    if (res.status !== 401) return res.json().then((data) => data);
    else {
      return { isAuthenticated: false, user: { username: "" } };
    }
  });
};

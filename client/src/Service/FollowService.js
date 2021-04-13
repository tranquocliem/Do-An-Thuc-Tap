import axios from "axios";

export const follow = (variable) => {
  return axios
    .post("/api/follow/following", variable)
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

export const unFollow = (variable) => {
  return axios
    .post("/api/follow/unfollow", variable)
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

export const getMyFollowing = () => {
  return axios
    .get("/api/follow/getMyFollowing")
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

export const getMyFollowers = () => {
  return axios
    .get("/api/follow/getMyFollowers")
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

export const getFollowing = (id) => {
  return axios
    .post("/api/follow/getFollowing", id)
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

export const getFollowers = (id) => {
  return axios
    .post("/api/follow/getFollowers", id)
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

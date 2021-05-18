const express = require("express");
const accRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const JWT = require("jsonwebtoken");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const NodeRSA = require("node-rsa");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const SendMail = require("../configs/SendMail");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// register
accRouter.post("/register", async (req, res) => {
  try {
    const {
      email,
      fullname,
      website,
      phone,
      story,
      gender,
      username,
      password,
    } = req.body;

    public_key = fs.readFileSync(
      path.resolve(__dirname, "../configs/publickey.key")
    );
    let key_public = new NodeRSA(public_key);
    let end = key_public.encrypt(password, process.env.PUBLIC_KEY);
    const passwordHash = end;

    const acc = await Account.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (acc) {
      if (acc.email === email && acc.username === username) {
        return res.status(201).json({
          message: {
            msgBody: "Username và Email đã tồn tại",
            msgError: true,
          },
        });
      } else if (acc.username === username) {
        return res.status(201).json({
          message: {
            msgBody: "Username đã tồn tại",
            msgError: true,
          },
        });
      } else if (acc.email === email) {
        return res.status(201).json({
          message: {
            msgBody: "Email đã tồn tại",
            msgError: true,
          },
        });
      }
    }
    const token = await JWT.sign(
      {
        email,
        fullname,
        website,
        phone,
        story,
        gender,
        username,
        passwordHash,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "1d",
      }
    );

    const url = `http://localhost:3000/user/activate/${token}`;

    // await SendMail.sendMail(
    //   email,
    //   url,
    //   "Kích Hoạt Tài Khoản",
    //   "Xin chúc mừng! Bạn sắp bắt đầu sử dụng 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵.",
    //   "Xác thực email",
    //   "24 giờ"
    // );

    await SendMail.sendGrid(
      email,
      url,
      "Kích Hoạt Tài Khoản",
      "Xin chúc mừng! Bạn sắp bắt đầu sử dụng 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵.",
      "Xác thực email",
      "24 giờ"
    );

    return res.status(200).json({
      success: true,
      message: {
        msgBody: "Tạo tài khoản thành công",
        msgError: false,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: {
        msgBody: "Có lỗi khi đăng ký",
        msgError: true,
      },
      error,
    });
  }
});

// xác thực email
accRouter.post("/activation", async (req, res) => {
  try {
    const { token } = req.body;
    const user = JWT.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    let password = user.passwordHash;

    private_key = fs.readFileSync(
      path.resolve(__dirname, "../configs/privatekey.key")
    );
    let key_private = new NodeRSA(private_key);
    password = key_private.decrypt(password, process.env.PRIVATE_KEY);

    const variable = {
      email: user.email,
      fullname: user.fullname,
      gender: user.gender,
      username: user.username,
      password: password,
    };

    const newAcc = new Account(variable);

    await newAcc.save();

    return res.status(200).json({
      success: true,
      message: {
        msgBody: "Xác thực tài khoản thành công!",
        msgError: false,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: {
        msgBody: "Có lỗi khi xác thực",
        msgError: true,
      },
      error,
    });
  }
});

//login
const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "QuocLiem",
      sub: userID,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
};

accRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, email, fullname, gender, username, status } = req.user;
      let token = signToken(_id);
      public_key = fs.readFileSync(
        path.resolve(__dirname, "../configs/publickey.key")
      );
      let key_public = new NodeRSA(public_key);
      let end = key_public.encrypt(token, process.env.PUBLIC_KEY);
      token = end;
      res.cookie("temp", token, {
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).json({
        isAuthenticated: true,
        message: {
          msgBody: "Đăng nhập thành công",
          msgError: false,
        },
        user: { _id, email, fullname, gender, username, status },
      });
    }
  }
);

//logout
accRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("temp");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

//Get thông tin User
accRouter.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Account.findOne({
        username: req.query.username,
      }).select("-password -resetLink -public_id");

      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(203).json({
          message: {
            msgBody: "Không có người này",
            msgError: true,
          },
          error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: {
          msgBody: "Lỗi!!!",
          msgError: true,
        },
        error,
      });
    }
  }
);

//Update thông tin user
accRouter.patch(
  "/updateUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { avatar, fullname, phone, story, website, gender, public_id } =
        req.body;
      if (!fullname) {
        return res
          .status(400)
          .json({ message: { msgBody: "Không để trống họ và tên" } });
      }

      if (public_id === 0) {
        await Account.findOneAndUpdate(
          { _id: req.user._id },
          { avatar, fullname, phone, story, website, gender }
        );
      } else {
        await Account.findOneAndUpdate(
          { _id: req.user._id },
          { avatar, fullname, phone, story, website, gender, public_id }
        );
      }

      res.status(200).json({
        message: {
          msgBody: "Cập nhật thông tin thành công",
          msgError: false,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: {
          msgBody: "Cập nhật không thành công",
          msgError: true,
        },
        error,
      });
    }
  }
);

//Xoá ảnh cloudinary
accRouter.get(
  "/destroyAvatar",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { public_id } = req.user;
      if (!public_id) {
        return res.status(203).json({
          success: false,
          message: {
            msgBody: "Hình ảnh không tồn tại",
            msgError: true,
          },
        });
      }
      cloudinary.uploader.destroy(public_id, async (err, result) => {
        if (err) throw err;

        res.status(200).json({
          success: true,
          message: {
            msgBody: "Xoá thành công",
            msgError: false,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: {
          msgBody: "Lỗi!!!",
          msgError: true,
        },
        error,
      });
    }
  }
);

// Gợi ý
accRouter.get(
  "/suggestions",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 5;

      const users = await Account.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: num } },
        // {
        //   $lookup: {
        //     from: "Account",
        //     localField: "followers",
        //     foreignField: "_id",
        //     as: "followers",
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "Account",
        //     localField: "following",
        //     foreignField: "_id",
        //     as: "following",
        //   },
        // },
      ]).project("-password");

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy gợi ý thành công",
          msgError: false,
        },
        total: users.length,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: {
          msgBody: "Lỗi!!!",
          msgError: true,
        },
      });
    }
  }
);

//gửi link qua mail để đặt lại mật khẩu đã quên
accRouter.post("/forgetPass", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: {
        msgBody: "Vui lòng nhập E-mail",
        msgError: true,
      },
    });
  } else {
    try {
      const user = await Account.findOne({ email });

      if (!user) {
        return res.status(203).json({
          success: false,
          message: {
            msgBody: "E-mail không tồn tại",
            msgError: true,
          },
        });
      } else {
        const valiToken = user.resetLink;

        JWT.verify(valiToken, process.env.JWT_RESET_PASSWORD, async (err) => {
          if (err) {
            if ((err.name && err.name === "TokenExpiredError") || !valiToken) {
              const token = await JWT.sign(
                { _id: user._id },
                process.env.JWT_RESET_PASSWORD,
                { expiresIn: "10m" }
              );

              const url = `http://localhost:3000/resetPassword/${token}`;

              await user.updateOne({ resetLink: token });

              await SendMail.sendGrid(
                email,
                url,
                "Đặt Lại Mật Khẩu",
                "Bạn đã quên mật khẩu khi sử dụng 𝓲𝓷𝓼𝓽𝓪𝓰𝓲𝓻𝓵.",
                "Đặt lại mật khẩu",
                "10 phút"
              );

              return res.status(200).json({
                success: true,
                message: {
                  msgBody: "Thành công",
                  msgError: false,
                },
              });
            } else {
              res.status(203).json({
                success: false,
                message: {
                  msgBody: "Có lỗi khi xử lý",
                  msgError: true,
                },
              });
            }
          } else if (!err || valiToken) {
            return res.status(201).json({
              success: false,
              message: {
                msgBody:
                  "E-mail này đã được gửi rồi. Nếu có vần đề có thể gửi lại sau 10 phút",
                msgError: true,
              },
            });
          }
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: {
          msgBody: "Có lỗi xãy ra",
          msgError: true,
        },
        error,
      });
    }
  }
});

//reset lại mật khẩu đã quên
accRouter.post("/resetPass", (req, res) => {
  const { resetLink, newPassword } = req.body;

  if (newPassword && resetLink) {
    JWT.verify(resetLink, process.env.JWT_RESET_PASSWORD, (err) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi với mã hoặc không còn hiệu lực",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        Account.findOne({ resetLink }, (err, user) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: {
                msgBody: "Có lỗi khi tìm kiếm tài khoản này",
                msgError: true,
              },
            });
            return;
          } else if (!user) {
            res.status(201).json({
              success: false,
              message: {
                msgBody: "Đường link không còn tồn tại",
                msgError: true,
              },
            });
            return;
          } else {
            const updatePassword = {
              password: newPassword,
              resetLink: "",
            };
            // hàm extend() giúp overwrite lại user
            // vd: user = {_id:"1",username:"liem",password:"123456",resetLink:"gheyf"}
            // extend({_id:"1",username:"liem",password:"123456",resetLink:"gheyf"},{password: 1234567,resetLink: "",})
            // => user = {_id:"1",username:"liem",password:"1234567",resetLink:""}
            user = lodash.extend(user, updatePassword);
            //hàm save nếu _id đã tồn tại sẽ update ngược lại thì sẽ là insert
            user.save((err) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: {
                    msgBody: "Đặt lại mật khẩu không thành công",
                    msgError: true,
                  },
                  err,
                });
                return;
              } else {
                return res.status(200).json({
                  success: true,
                  message: {
                    msgBody: "Đã đặt lại mật khẩu thành công!",
                    msgError: false,
                  },
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: {
        msgBody: "Lỗi!!! không đủ thông tin",
        msgError: true,
      },
    });
    return;
  }
});

//kiểm tra mã token
accRouter.post("/examJWT", (req, res) => {
  const { token } = req.body;

  //token hết hạn
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmYxNDgyYTZlYzAzZjM0ZWM1YjUwNmEiLCJpYXQiOjE2MDk3MjYzMjMsImV4cCI6MTYwOTcyNjkyM30.Qmnrq9UFggNM4l8DO-I-kOa3UKeiS1YXmi8Bp2Fbqtw

  JWT.verify(token, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
    if (err) {
      if ((err.name && err.name === "TokenExpiredError") || !token) {
        res.status(400).json({
          message: {
            msgBody: "Hết hạn",
            msgError: true,
          },
          err,
        });
        return;
      } else {
        res.status(400).json({
          message: {
            msgBody: "Có lỗi",
            msgError: true,
          },
          err,
        });
        return;
      }
    } else {
      res.status(200).json({
        message: {
          msgBody: "Ok!!!",
          msgError: false,
        },
        decoded,
      });
    }
  });
});

//đổi mật khẩu tài khoản
accRouter.post(
  "/changePass",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { old_Password, password, configPassword } = req.body;
    const { username, email } = req.user;
    Account.findOne(
      { $or: [{ username: username }, { email: email }] },
      (err, user) => {
        if (err || !user) {
          return res.status(500).json({
            message: {
              msgBody: "Lỗi hoặc tài khoản không tồn tại",
              msgError: true,
            },
            err,
          });
        }
        if (password !== configPassword) {
          return res.status(203).json({
            message: {
              msgBody: "Mật khẩu xác nhận không đúng",
              msgError: true,
            },
          });
        }
        //cần nhập pass củ và so sánh với pass với csdl
        // bcrypt.compare(
        //   old_Password,
        //   req.user.password,
        //   function (err, isMatch) {
        //     console.log(err);
        //   }
        // );
        bcrypt.compare(
          old_Password,
          req.user.password,
          function (err, isMatch) {
            if (err) {
              res.status(400).json({
                message: {
                  msgBody: "Có Lỗi!!!",
                  msgError: true,
                },
                err,
              });
            }
            if (!isMatch) {
              res.status(203).json({
                isMatch: isMatch,
                message: {
                  msgBody: "Mật khẩu cũ không đúng",
                  msgError: true,
                },
              });
            } else {
              const updatePassword = {
                password: password,
              };
              user = lodash.extend(user, updatePassword);
              user.save((err, result) => {
                if (err) {
                  return res.status(500).json({
                    message: {
                      msgBody: "Lỗi thêm không thành công",
                      msgError: true,
                    },
                    err,
                  });
                }
                res.status(200).json({
                  message: {
                    msgBody: "Thay Đổi Mật Khẩu Thành Công",
                    msgError: false,
                  },
                });
              });
            }
          }
        );
      }
    );
  }
);

//search user
accRouter.get(
  "/searchUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await Account.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username avatar");
      res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({
        message: {
          msgBody: "Lỗi!!!",
          msgError: true,
        },
        error,
      });
    }
  }
);

//tài khoản đang hiện hành
accRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      _id,
      fullname,
      email,
      username,
      gender,
      avatar,
      phone,
      website,
      story,
      following,
      followers,
      status,
    } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: {
        _id,
        fullname,
        email,
        username,
        gender,
        avatar,
        phone,
        website,
        story,
        following,
        followers,
        status,
      },
    });
  }
);

module.exports = accRouter;

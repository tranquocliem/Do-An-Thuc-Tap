const express = require("express");
const accRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const JWT = require("jsonwebtoken");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const NodeRSA = require("node-rsa");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// //gửi mail để xác thực
// accRouter.post("/sendMail", async (req, res) => {
//   const { email, username, role } = req.body;

//   const oAuth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URL
//   );

//   oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

//   const accessToken = await oAuth2Client.getAccessToken();

//   Account.findOne(
//     { $or: [{ username: username }, { email: email }] },
//     (err, user) => {
//       if (err) {
//         res.status(400).json({
//           message: {
//             msgBody: "Có lỗi khi tìm kiếm với CSDL 1",
//             msgError: true,
//           },
//         });
//         return;
//       } else if (user) {
//         if (user.username === username) {
//           res.status(201).json({
//             message: {
//               msgBody: "Tên đăng nhập đã tồn tại",
//               msgError: true,
//             },
//           });
//         } else {
//           res.status(201).json({
//             message: {
//               msgBody: "Email đã tồn tại",
//               msgError: true,
//             },
//           });
//         }
//       } else if (role === "spadmin" || role === "admin") {
//         res.status(201).json({
//           message: {
//             msgBody: "Không có loại tài khoản này",
//             msgError: true,
//           },
//         });
//       } else {
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             type: "OAuth2",
//             user: "tranquocliem12c6@gmail.com",
//             clientId: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             refreshToken: process.env.REFRESH_TOKEN,
//             accessToken: accessToken,
//           },
//           // service: "gmail",
//           // auth: {
//           //   user: "tranquocliem12c6@gmail.com",
//           //   pass: process.env.pass,
//           // },
//         });
//         const token = JWT.sign(
//           {
//             username,
//             email,
//             role,
//           },
//           process.env.JWT_ACCOUNT_ACTIVATION,
//           {
//             expiresIn: "10m",
//           }
//         );
//         const mainOptions = {
//           // thiết lập đối tượng, nội dung gửi mail
//           // <p>Link: ${process.env.CLIENT_URL}/activate/${token}&150999</p>
//           from: "tranquocliem12c6@gmail.com",
//           to: email,
//           subject: "Kích Hoạt Tài Khoản",
//           html: `
//                         <h1>Vui Lòng Sử Dụng Đường Link Phía Dưới Để Kích Hoạt Tài Khoản</h1>
//                         <p>Link: <a href="http://localhost:3000/activate/${token}&150999">Click Vào Đây!!!</a></p>
//                         <h3 style="color:red;">Lưu ý: Đường Link Này Chỉ Có Thời Hạn Là 10 Phút Sau Thời Hạn Sẽ Không Còn Hiệu Lực Nũa!!!</h3>
//                         <hr />
//                         <p>Xin gửi lời cảm ơn đến bạn!!!</p>
//                     `,
//         };
//         // console.log(token);
//         transporter.sendMail(mainOptions, (err) => {
//           if (err) {
//             res.status(400).json({
//               success: false,
//               message: {
//                 msgBody: "Có lỗi khi gửi mail",
//                 msgError: true,
//               },
//               err,
//             });
//             return;
//           } else {
//             return res.status(200).json({
//               success: true,
//               message: {
//                 msgBody: "Đăng ký thành công",
//                 msgError: false,
//               },
//             });
//           }
//         });
//       }
//     }
//   );
// });

// //tạo tài khoản cho loại candidate và recruiter (cần gửi xác thực mail)
// accRouter.post("/register", (req, res) => {
//   const { token, password, confirmPass } = req.body;

//   if (token) {
//     JWT.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({
//           success: false,
//           message: {
//             msgBody: "Có lỗi với token",
//             msgError: true,
//           },
//           err,
//         });
//       } else {
//         if (password && confirmPass && password == confirmPass) {
//           const { username, email, role } = JWT.decode(token);
//           const newAccount = new Account({ email, username, password, role });

//           newAccount.save((err) => {
//             if (err) {
//               return res.status(401).json({
//                 success: false,
//                 message: {
//                   msgBody: "Có lỗi khi thêm tạo tài khoản này",
//                   msgError: true,
//                 },
//                 err,
//               });
//             } else {
//               return res.status(200).json({
//                 success: true,
//                 message: {
//                   msgBody: "Tạo tài khoản thành công",
//                   msgError: false,
//                 },
//               });
//             }
//           });
//         } else if (!password && !confirmPass) {
//           return res.status(203).json({
//             success: false,
//             message: {
//               msgBody: "Vui lòng không bỏ trống mật khẩu và xác nhận mật khẩu",
//               msgError: true,
//             },
//           });
//         } else if (!password) {
//           return res.status(203).json({
//             success: false,
//             message: {
//               msgBody: "Vui lòng không bỏ trống mật khẩu",
//               msgError: true,
//             },
//           });
//         } else if (!confirmPass) {
//           return res.status(203).json({
//             success: false,
//             message: {
//               msgBody: "Vui lòng không bỏ trống xác nhận mật khẩu",
//               msgError: true,
//             },
//           });
//         } else if (password != confirmPass) {
//           return res.status(203).json({
//             success: false,
//             message: {
//               msgBody: "Hai mật không khớp với nhau. Vui lòng nhập lại",
//               msgError: true,
//             },
//           });
//         }
//       }
//     });
//   } else {
//     return res.status(401).json({
//       success: false,
//       message: {
//         msgBody: "Tạo tài khoản thất bại",
//         msgError: true,
//       },
//     });
//   }
// });

//tạo tài khoản (không cần gửi xác thực mail sử dung cho localhost)
accRouter.post("/register", (req, res) => {
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
  Account.findOne(
    { $or: [{ username: username }, { email: email }] },
    (err, user) => {
      if (err)
        res.status(500).json({
          message: {
            msgBody: "Có lỗi khi tìm kiếm với CSDL 1",
            msgError: true,
          },
        });
      else if (user) {
        if (user.email === email && user.username === username) {
          res.status(201).json({
            message: {
              msgBody: "Username và Email đã tồn tại",
              msgError: true,
            },
          });
        } else if (user.username === username) {
          res.status(201).json({
            message: {
              msgBody: "Username đã tồn tại",
              msgError: true,
            },
          });
        } else if (user.email === email) {
          res.status(201).json({
            message: {
              msgBody: "Email đã tồn tại",
              msgError: true,
            },
          });
        }
      } else {
        const newAccount = new Account({
          email,
          fullname,
          gender,
          username,
          password,
          phone,
          story,
          website,
        });
        newAccount.save((err) => {
          if (err)
            res.status(500).json({
              message: {
                msgBody: "Có lỗi khi thêm tài khoản vào CSDL 2",
                msgError: true,
                err,
              },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "Tạo tài khoản thành công",
                msgError: false,
              },
            });
        });
      }
    }
  );
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
      const {
        avatar,
        fullname,
        phone,
        story,
        website,
        gender,
        public_id,
      } = req.body;
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
      const { _id } = req.user;
      const user = await Account.findOne({ _id });
      const public_id = user.public_id;
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

//gửi link qua mail để đặt lại mật khẩu đã quên
accRouter.post("/forgetPass", (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: {
        msgBody: "Vui lòng nhập E-mail",
        msgError: true,
      },
    });
    return;
  } else {
    Account.findOne({ email }, (err, user) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi xãy ra",
            msgError: true,
          },
        });
        return;
      } else if (!user) {
        return res.status(201).json({
          success: false,
          message: {
            msgBody: "E-mail không tồn tại",
            msgError: true,
          },
        });
      } else {
        const valiToken = user.resetLink;

        JWT.verify(valiToken, process.env.JWT_RESET_PASSWORD, (err) => {
          if (err) {
            if ((err.name && err.name === "TokenExpiredError") || !valiToken) {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  type: "OAuth2",
                  user: "tranquocliem12c6@gmail.com",
                  clientId: process.env.CLIENT_ID,
                  clientSecret: process.env.CLIENT_SECRET,
                  refreshToken: process.env.REFRESH_TOKEN,
                  accessToken: accessToken,
                },
              });

              const token = JWT.sign(
                { _id: user._id },
                process.env.JWT_RESET_PASSWORD,
                { expiresIn: "10m" }
              );

              const mainOptions = {
                // thiết lập đối tượng, nội dung gửi mail
                // <p>Link: ${process.env.CLIENT_URL}/activate/${token}&150999</p>
                from: "tranquocliem12c6@gmail.com",
                to: email,
                subject: "Đặt Lại Mật Khẩu",
                html: `
                              <h1>Vui Lòng Sử Dụng Đường Link Phía Dưới Để Đặt Lại Mật Khẩu</h1>
                              <p>Link: <a href="http://localhost:3000/resetPassword/${token}&150999">Click Vào Đây!!!</a></p>
                              <h3 style="color:red;">Lưu ý: Đường Link Này Chỉ Có Thời Hạn Là 10 Phút Sau Thời Hạn Sẽ Không Còn Hiệu Lực Nũa!!!</h3>
                              <hr />
                              <p>Xin gửi lời cảm ơn đến bạn!!!</p>
                          `,
              };

              return user.updateOne({ resetLink: token }, (err) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: {
                      msgBody: "Có lỗi xãy ra",
                      msgError: true,
                    },
                  });
                  return;
                } else {
                  transporter.sendMail(mainOptions, (err) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: {
                          msgBody: "Có lỗi khi gửi mail",
                          msgError: true,
                        },
                        err,
                      });
                      return;
                    } else {
                      return res.status(200).json({
                        success: true,
                        message: {
                          msgBody: "Thành công!",
                          msgError: false,
                        },
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).json({
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
    });
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
            msgBody: "Có lỗi với mã",
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
          return res.status(400).json({
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
              res.status(400).json({
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

const express = require("express");
const postRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Post = require("../models/Post");

// Tạo bài viết
postRouter.post(
  "/createPost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content, images } = req.body;

      let variable = {
        content,
        images,
        writer: req.user._id,
      };

      if (images.length === 0) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Vui lòng đăng tải một tấm ảnh",
            msgError: true,
          },
        });
      }

      const post = new Post(variable);
      await post.save();

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Tại bài viết thành công",
          msgError: false,
        },
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: {
          msgBody: "Tại bài viết không thành công",
          msgError: true,
        },
        error,
      });
    }
  }
);

module.exports = postRouter;

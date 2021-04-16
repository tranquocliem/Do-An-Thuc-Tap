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

// Get bài viết theo tài khoản và người tài khoản này đang theo dõi
postRouter.get(
  "/getPost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id, following } = req.user;

      const posts = await Post.find({ writer: [...following, _id] })
        .sort("-createdAt")
        .populate("writer", "username fullname avatar");

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        total: posts.length,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: {
          msgBody: "Lấy bài viết không thành công",
          msgError: true,
        },
        error,
      });
    }
  }
);

module.exports = postRouter;

const express = require("express");
const postRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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
postRouter.post(
  "/getPost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const skip = req.body.skip ? req.body.skip : 0;
      const { _id, following } = req.user;

      const posts = await Post.find({ writer: [...following, _id] })
        .sort("-createdAt")
        .skip(skip)
        .limit(3)
        .populate("writer", "username fullname avatar")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      const total = await Post.countDocuments({ writer: [...following, _id] });

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        total: total,
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

// Get bài viết theo id
postRouter.get(
  "/postById",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const _id = req.query.id;

      const post = await Post.findOne({ _id })
        .populate("writer", "username fullname avatar")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: {
          msgBody: "Lấy bài viết không thành công",
          msgError: true,
        },
      });
    }
  }
);

// Get bài viết theo tác giả
postRouter.get(
  "/postByWriter",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { writer } = req.query;

      if (req.user._id.toString() !== writer.toString()) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi về quyền",
            msgError: true,
          },
        });
      }

      const posts = await Post.find({ writer })
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
      });
    }
  }
);

//Xoá ảnh cloudinary
postRouter.post(
  "/destroyImages",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { public_id } = req.body;
      public_id.map((id) => {
        cloudinary.uploader.destroy(id, async (err, result) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: {
                msgBody: "Lôi!!!",
                msgError: true,
              },
              err,
            });
          }
        });
      });
      res.status(200).json({
        success: true,
        message: {
          msgBody: "Xoá thành công",
          msgError: false,
        },
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

//Update post
postRouter.patch(
  "/updatePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content, images } = req.body;

      const fpost = await Post.findOne({ _id: req.query.id }).populate(
        "writer",
        "username fullname avatar"
      );

      if (req.user._id.toString() === fpost.writer._id.toString()) {
        await Post.findOneAndUpdate(
          { _id: req.query.id },
          {
            content,
            images,
          }
        );

        res.status(200).json({
          success: true,
          message: {
            msgBody: "Cập nhật thành công",
            msgError: false,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi về quyền truy cập",
            msgError: true,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: {
          msgBody: "Cập nhật không thành công",
          msgError: true,
        },
        error,
      });
    }
  }
);

module.exports = postRouter;

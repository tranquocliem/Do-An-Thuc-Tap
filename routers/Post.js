const express = require("express");
const postRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const Comment = require("../models/Comment");
const ReplyComment = require("../models/ReplyComment");
const Heart = require("../models/Heart");
const HeartComment = require("../models/HeartComment");
const SavePost = require("../models/SavePost");
const Multer = require("../configs/Multer");
const fs = require("fs");

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
          msgBody: "Tạo bài viết thành công",
          msgError: false,
        },
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: {
          msgBody: "Tạo bài viết không thành công",
          msgError: true,
        },
        error,
      });
    }
  }
);

// Get bài viết theo tài khoản và người tài khoản này đang theo dõi (Home)
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
        .populate("writer", "username fullname avatar followers");
      // .populate({
      //   path: "comments",
      //   populate: {
      //     path: "user likes",
      //     select: "-password",
      //   },
      // });
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

// Get bài viết theo id (detail Post)
postRouter.get(
  "/postById",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const _id = req.query.id;

      const post = await Post.findOne({ _id }).populate(
        "writer",
        "username fullname avatar followers"
      );

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

// Get bài viết theo tác giả (Profile)
postRouter.get(
  "/postByWriter",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { writer } = req.query;

      const skip = req.query.skip ? req.query.skip : 0;

      const posts = await Post.find({ writer })
        .sort("-createdAt")
        .skip(parseInt(skip))
        .limit(4)
        .populate("writer", "username fullname avatar");

      const totalPosts = await Post.countDocuments({ writer });

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        total: totalPosts,
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

// Get bài viết cho discover
postRouter.get(
  "/getPostDiscover",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const skip = req.query.skip ? req.query.skip : 0;
      const { _id, following } = req.user;

      const posts = await Post.find({ writer: { $nin: [...following, _id] } })
        .sort("-createdAt")
        .skip(parseInt(skip))
        .limit(8)
        .populate("writer", "username fullname avatar");

      const total = await Post.countDocuments({
        writer: { $nin: [...following, _id] },
      });

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

// Delete post
postRouter.delete(
  "/deletePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.query;
      const post = await Post.findOne({ _id });

      if (post) {
        const IMG = post.images;
        const writer = post.writer;
        if (req.user._id.toString() === writer.toString()) {
          IMG.map((item) => {
            cloudinary.uploader.destroy(item.public_id, async (err, result) => {
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

          await Post.deleteOne({ _id });
          await Comment.deleteMany({ postId: _id });
          await ReplyComment.deleteMany({ postId: _id });
          await Heart.deleteMany({ postId: _id });
          await HeartComment.deleteMany({ postId: _id });
          await SavePost.deleteMany({ postId: _id });

          return res.status(200).json({
            success: true,
            message: {
              msgBody: "Xoá bài viết thành công",
              msgError: false,
            },
          });
        } else {
          return res.status(400).json({
            success: false,
            message: {
              msgBody: "Có lỗi về quyền",
              msgError: true,
            },
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bài viết không tồn tại",
            msgError: true,
          },
        });
      }
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

postRouter.post(
  "/uploadImage",
  passport.authenticate("jwt", { session: false }),
  Multer.array("images"),
  async (req, res) => {
    try {
      let arrImages = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const data = await cloudinary.uploader.upload(path, {
          public_id: `test/${new Date().toISOString()}_${file.originalname}`,
          overwrite: true,
        });
        arrImages.push({ public_id: data.public_id, url: data.secure_url });
        fs.unlinkSync(path);
      }

      return res.status(200).json({
        success: false,
        message: {
          msgBody: "Upload Ok!",
          msgError: false,
        },
        data: arrImages,
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

module.exports = postRouter;

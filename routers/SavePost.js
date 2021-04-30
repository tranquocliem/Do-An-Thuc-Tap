const express = require("express");
const savePostRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Post = require("../models/Post");
const SavePost = require("../models/SavePost");
const Account = require("../models/Account");

// Save post
savePostRouter.post(
  "/createSavePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId } = req.body;
      const userId = req.user._id;
      const newSavePost = new SavePost({ userId, postId });

      const post = await Post.findOne({ _id: postId });
      const savePost = await SavePost.findOne({ userId, postId });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bài viết không tồn tại",
            msgError: true,
          },
        });
      } else if (post.writer.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bạn là tác giả của bài viết này",
            msgError: true,
          },
        });
      }

      if (savePost) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bạn đã lưu bài viết này rồi",
            msgError: true,
          },
        });
      }

      await newSavePost.save();

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lưu bài viết thành công",
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

// Get save post by userId
savePostRouter.get(
  "/getSavePostByUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;

      const skip = req.query.skip ? req.query.skip : 0;

      const savePost = await SavePost.find({ userId })
        .populate({
          path: "postId",
          model: Post,
          options: {
            populate: {
              path: "writer",
              model: Account,
              select: "-password",
            },
          },
        })
        .sort("-createdAt")
        .skip(parseInt(skip))
        .limit(4);

      const totalSavePost = await SavePost.countDocuments({ userId });

      return res.status(200).json({
        success: true,
        total: totalSavePost,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        savePost,
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

// Get save post by postId
savePostRouter.get(
  "/getSavePostByPost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId } = req.query;
      const savePost = await SavePost.find({ postId }).populate({
        path: "postId",
        model: Post,
        options: {
          populate: {
            path: "writer",
            model: Account,
            select: "-password",
          },
        },
      });
      return res.status(200).json({
        success: true,
        total: savePost.length,
        message: {
          msgBody: "Lấy bài viết thành công",
          msgError: false,
        },
        savePost,
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

// Delete save post
savePostRouter.delete(
  "/deleteSavePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId } = req.query;
      const userId = req.user._id;

      await SavePost.findOneAndDelete({ userId, postId });

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Xoá bài viết thành công",
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

module.exports = savePostRouter;

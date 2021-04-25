const express = require("express");
const heartRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Heart = require("../models/Heart");
const Post = require("../models/Post");

// Thả tim
heartRouter.post(
  "/dropHeart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId } = req.body;

      const isHeart = await Heart.findOne({ userId, postId });

      const post = await Post.findOne({ _id: postId });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bài viết không tồn tại",
            msgErr: true,
          },
        });
      }

      if (isHeart) {
        return res.status(203).json({
          success: false,
          message: {
            msgBody: "Đã thả tim rồi",
            msgErr: true,
          },
        });
      }

      const dropHeart = new Heart({ userId, postId });

      await dropHeart.save();

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Thả tim thành công",
          msgErr: false,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Bỏ thả tim
heartRouter.delete(
  "/unHeart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId } = req.query;

      const unHeart = await Heart.findOneAndDelete({ userId, postId });

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Bỏ tim thành công",
          msgErr: false,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Get tim post
heartRouter.get(
  "/getHeartPost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.query;

      const hearts = await Heart.find({ postId: id });
      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy dữ liệu thành công",
          msgErr: false,
        },
        total: hearts.length,
        hearts,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Get tim user and post
heartRouter.get(
  "/getHeart",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.user;
      const { id } = req.query;

      const hearts = await Heart.find({ userId: _id, postId: id });
      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy dữ liệu thành công",
          msgErr: false,
        },
        total: hearts.length,
        hearts,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

module.exports = heartRouter;

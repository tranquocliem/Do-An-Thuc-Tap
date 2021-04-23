const express = require("express");
const heartCommentRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const HeartComment = require("../models/HeartComment");

// Thả tim comment
heartCommentRouter.post(
  "/dropHeartComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { commentId, replyHeart, postId } = req.body;

      const isHeart = await HeartComment.findOne({ userId, commentId });

      if (isHeart) {
        return res.status(203).json({
          success: false,
          message: {
            msgBody: "Đã thả tim rồi",
            msgErr: true,
          },
        });
      }

      const dropHeartComment = new HeartComment({
        userId,
        commentId,
        replyHeart,
        postId,
      });

      await dropHeartComment.save();

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

// Bỏ thả tim comment
heartCommentRouter.delete(
  "/unHeartComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { commentId } = req.query;

      await HeartComment.findOneAndDelete({ userId, commentId });

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

// Get tim comment
heartCommentRouter.get(
  "/getHeartComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.query;

      const hearts = await HeartComment.find({ commentId: id });
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

module.exports = heartCommentRouter;

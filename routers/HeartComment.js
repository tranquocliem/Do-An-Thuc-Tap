const express = require("express");
const heartCommentRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Comment = require("../models/Comment");
const ReplyComment = require("../models/ReplyComment");
const HeartComment = require("../models/HeartComment");
const Post = require("../models/Post");

// Thả tim comment
heartCommentRouter.post(
  "/dropHeartComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { commentId, replyHeart, postId } = req.body;

      const isHeart = await HeartComment.findOne({ userId, commentId });

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

      if (commentId === replyHeart) {
        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
          return res.status(400).json({
            success: false,
            message: {
              msgBody: "Bình luận không tồn tại",
              msgErr: true,
            },
          });
        }
      } else {
        const replyComment = await ReplyComment.findOne({
          _id: commentId,
          reply: replyHeart,
        });
        if (!replyComment) {
          return res.status(400).json({
            success: false,
            message: {
              msgBody: "Trả lời không tồn tại",
              msgErr: true,
            },
          });
        }
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

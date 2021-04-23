const express = require("express");
const commentRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Comment = require("../models/Comment");
const ReplyComment = require("../models/ReplyComment");
const HeartComment = require("../models/HeartComment");

// Tạo bình luận
commentRouter.post(
  "/createComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId, postUserId, content } = req.body;

      const newComment = new Comment({
        writer: req.user._id,
        content,
        postId,
        postUserId,
      });

      await newComment.save();

      return res.status(200).json({
        success: true,
        newComment,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Get comment by postid
commentRouter.get(
  "/getComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId, limit } = req.query;

      const comments = await Comment.find({ postId })
        .populate("writer", "-password")
        .sort("-createdAt")
        .limit(parseInt(limit));

      const totalComment = await Comment.countDocuments({ postId });
      const totalReplyComment = await ReplyComment.countDocuments({ postId });

      return res.status(200).json({
        success: true,
        totalComment,
        totalReplyComment,
        total: totalComment + totalReplyComment,
        comments,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Update comment
commentRouter.patch(
  "/updateComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.query;
      const { content } = req.body;

      await Comment.findOneAndUpdate(
        { _id, writer: req.user._id },
        { content }
      );

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Cập nhật bình luận thành công",
          msgErr: false,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Delete comment
commentRouter.delete(
  "/deleteComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.query;
      const userId = req.user._id;

      const comment = await Comment.findOne({ _id });

      if (
        userId.toString() === comment.writer.toString() ||
        userId.toString() === comment.postUserId.toString()
      ) {
        await Comment.findOneAndDelete({ _id });
        await ReplyComment.deleteMany({ reply: _id });
        await HeartComment.deleteMany({ commentId: _id });
        await HeartComment.deleteMany({ replyHeart: _id });
        return res.status(200).json({
          success: true,
          message: {
            msgBody: "Xoá bình luận thành công",
            msgErr: false,
          },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi về quyền",
            msgErr: true,
          },
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

module.exports = commentRouter;

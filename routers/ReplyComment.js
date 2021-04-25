const express = require("express");
const replyCommentRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Comment = require("../models/Comment");
const ReplyComment = require("../models/ReplyComment");
const HeartComment = require("../models/HeartComment");
const Post = require("../models/Post");

// Tạo reply bình luận
replyCommentRouter.post(
  "/createReplyComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content, tag, postId, postUserId, reply } = req.body;

      const newReplyComment = new ReplyComment({
        content,
        tag,
        postId,
        postUserId,
        reply,
        writer: req.user._id,
      });

      const post = await Post.findOne({ _id: postId });
      const comment = await Comment.findOne({ _id: reply });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bài viết không tồn tại",
            msgErr: true,
          },
        });
      }

      if (!comment) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Bình luận không tồn tại",
            msgErr: true,
          },
        });
      }

      await newReplyComment.save();

      return res.status(200).json({
        success: true,
        newReplyComment,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Get reply comment by postid và commentid
replyCommentRouter.get(
  "/getReplyComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId, reply, limit } = req.query;

      const Replycomments = await ReplyComment.find({ postId, reply })
        .populate("writer", "-password")
        .limit(parseInt(limit));

      const totalReplyComment = await ReplyComment.countDocuments({
        postId,
        reply,
      });

      return res.status(200).json({
        success: true,
        total: totalReplyComment,
        Replycomments,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Update reply comment
replyCommentRouter.patch(
  "/updateReplyComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.query;
      const { content } = req.body;

      await ReplyComment.findOneAndUpdate(
        { _id, writer: req.user._id },
        { content }
      );

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Cập nhật reply bình luận thành công",
          msgErr: false,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Delete reply comment
replyCommentRouter.delete(
  "/deleteReplyComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { _id } = req.query;
      const userId = req.user._id;

      const replyComment = await ReplyComment.findOne({ _id });

      if (
        userId.toString() === replyComment.writer.toString() ||
        userId.toString() === replyComment.postUserId.toString()
      ) {
        await ReplyComment.findOneAndDelete({ _id });
        await HeartComment.deleteMany({ commentId: _id });
        return res.status(200).json({
          success: true,
          message: {
            msgBody: "Xoá trả lời thành công",
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

module.exports = replyCommentRouter;

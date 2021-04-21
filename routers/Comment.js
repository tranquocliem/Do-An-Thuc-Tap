const express = require("express");
const commentRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Thả tim
commentRouter.post(
  "/createComment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { postId, content, tag, reply } = req.body;
      const newComment = new Comment({
        user: req.user._id,
        content,
        postId,
        tag,
        reply,
      });

      await newComment.save();

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );

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
        .populate("user", "-password")
        .sort("-createdAt")
        .limit(parseInt(limit));

      const totalComment = await Comment.countDocuments({ postId });

      return res.status(200).json({
        success: true,
        total: totalComment,
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

      await Comment.findOneAndUpdate({ _id, user: req.user._id }, { content });

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

module.exports = commentRouter;

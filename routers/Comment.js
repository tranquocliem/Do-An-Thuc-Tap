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

module.exports = commentRouter;

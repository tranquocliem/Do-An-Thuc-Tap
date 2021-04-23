const mongoose = require("mongoose");

const HeartCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Account" },
    commentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
    replyHeart: { type: mongoose.Types.ObjectId, ref: "Comment" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeartComment", HeartCommentSchema);

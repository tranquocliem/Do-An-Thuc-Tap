const mongoose = require("mongoose");

const HeartCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Account" },
    commentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeartComment", HeartCommentSchema);

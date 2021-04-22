const mongoose = require("mongoose");

const HeartReplyCommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Account" },
    ReplycommentId: { type: mongoose.Types.ObjectId, ref: "ReplyComment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeartReplyComment", HeartReplyCommentSchema);

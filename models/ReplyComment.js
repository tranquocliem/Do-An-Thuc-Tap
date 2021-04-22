const mongoose = require("mongoose");

const ReplyCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    tag: Object,
    reply: { type: mongoose.Types.ObjectId, ref: "Comment" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
    postUserId: { type: mongoose.Types.ObjectId, ref: "Account" },
    writer: { type: mongoose.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReplyComment", ReplyCommentSchema);

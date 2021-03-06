const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
    postUserId: { type: mongoose.Types.ObjectId, ref: "Account" },
    writer: { type: mongoose.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);

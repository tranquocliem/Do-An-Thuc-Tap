const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "Account" }],
    user: { type: mongoose.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);

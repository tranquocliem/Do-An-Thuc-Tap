const mongoose = require("mongoose");

const SavePostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Account" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavePost", SavePostSchema);

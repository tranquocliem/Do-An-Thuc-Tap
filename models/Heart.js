const mongoose = require("mongoose");

const HeartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "Account" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Heart", HeartSchema);

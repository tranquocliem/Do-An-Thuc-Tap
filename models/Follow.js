const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema(
  {
    following: { type: mongoose.Types.ObjectId, ref: "Account" },
    followers: { type: mongoose.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follow", FollowSchema);

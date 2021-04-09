const mongoose = require("mongoose");

const AddFriendSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "Account" },
    receiver: { type: mongoose.Types.ObjectId, ref: "Account" },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddFriend", AddFriendSchema);

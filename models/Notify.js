const mongoose = require("mongoose");

const NotifySchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    sender: { type: mongoose.Types.ObjectId, ref: "Account" },
    receiver: [mongoose.Types.ObjectId],
    url: String,
    text: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notify", NotifySchema);

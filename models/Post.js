const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      require: true,
    },
    writer: { type: mongoose.Types.ObjectId, ref: "Account" },
    likes: [{ type: mongoose.Types.ObjectId, ref: "Account" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

const express = require("express");
const followRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Account = require("../models/Account");
const { findOneAndDelete } = require("../models/Follow");
const Follow = require("../models/Follow");

// Follow
followRouter.post(
  "/following",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user._id.toString() === req.body.followers) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Lỗi!!!",
            msgErr: true,
          },
        });
      }

      let variable = {
        following: req.user._id,
        followers: req.body.followers,
      };

      const user = await Follow.find({
        following: req.user._id,
        followers: req.body.followers,
      });

      if (user.length > 0) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Đã theo dõi rồi!!",
            msgErr: true,
          },
        });
      } else {
        const follow = new Follow(variable);
        await follow.save();
        await Account.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              following: req.body.followers,
            },
          },
          { new: true }
        );
        await Account.findOneAndUpdate(
          { _id: req.body.followers },
          {
            $push: {
              followers: req.user._id,
            },
          },
          { new: true }
        );
        return res.status(200).json({ success: true, follow });
      }
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
);

// UnFollow
followRouter.delete(
  "/unfollow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let variable = { following: req.user._id, followers: req.body.followers };
      await Follow.findOneAndDelete(variable);
      await Account.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            following: req.body.followers,
          },
        },
        { new: true }
      );
      await Account.findOneAndUpdate(
        { _id: req.body.followers },
        {
          $pull: {
            followers: req.user._id,
          },
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
);

module.exports = followRouter;

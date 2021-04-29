const express = require("express");
const { forIn } = require("lodash");
const notifyRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../configs/passport");
const Notify = require("../models/Notify");

// Tạo thông báo
notifyRouter.post(
  "/createNotify",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id, receiver, url, text, content, image } = req.body;
      const sender = req.user._id;

      if (receiver.length <= 0) return;

      const notify = new Notify({
        id,
        sender,
        receiver,
        url,
        text,
        content,
        image,
      });

      await notify.save();
      return res.status(200).json({
        success: true,
        notify,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Lấy thông báo
notifyRouter.get(
  "/getNotify",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const notify = await Notify.find({ receiver: req.user._id })
        .sort("-createdAt")
        .populate("sender", "avatar username");

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Lấy thông báo thành công",
          msgError: false,
        },
        total: notify.length,
        notify,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Xoá thông báo
notifyRouter.delete(
  "/deleteNotify",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.query;
      const notify = await Notify.findOne({ _id: id });
      const ids = notify.receiver;

      const found = ids.includes(req.user._id);

      if (!found) {
        return res.status(400).json({
          success: false,
          message: {
            msgBody: "Có lỗi về quyền",
            msgError: true,
          },
        });
      } else {
        if (notify.receiver.length <= 1) {
          await Notify.findOneAndDelete({ _id: id });
          return res.status(200).json({
            success: true,
            message: {
              msgBody: "Xoá thông báo thành công",
              msgError: false,
            },
          });
        } else {
          await Notify.findOneAndUpdate(
            { _id: id },
            {
              $pull: {
                receiver: req.user._id,
              },
            },
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: {
              msgBody: "Xoá thông báo thành công",
              msgError: false,
            },
          });
        }
      }
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

// Xoá tất cả thông báo
notifyRouter.delete(
  "/deleteAllNotify",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const notifies = await Notify.find({ receiver: req.user._id });

      notifies.map(async (notify) => {
        if (notify.receiver.length <= 1) {
          await Notify.deleteOne({ receiver: req.user._id });
        } else {
          await Notify.findOneAndUpdate(
            { receiver: req.user._id },
            {
              $pull: {
                receiver: req.user._id,
              },
            },
            { new: true }
          );
        }
      });

      return res.status(200).json({
        success: true,
        message: {
          msgBody: "Xoá tất cả thông báo thành công",
          msgError: false,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }
);

module.exports = notifyRouter;

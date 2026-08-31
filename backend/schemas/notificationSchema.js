const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    type: { type: String, enum: ["email", "sms"], required: true },
    recipient: String,
    subject: String,
    message: String,
    status: { type: String, default: "MOCK_SENT" }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification };

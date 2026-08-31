const { Notification } = require("../schemas/notificationSchema");

async function list(req, res) {
  const items = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json(items);
}

module.exports = { list };

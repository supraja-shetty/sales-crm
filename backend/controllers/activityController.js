const { ActivityLog } = require("../schemas/activitySchema");

async function list(req, res) {
  const items = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
  res.json(items);
}

module.exports = { list };

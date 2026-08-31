const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    userName: String,
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: mongoose.Schema.Types.ObjectId,
    description: { type: String, required: true },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activitySchema);
module.exports = { ActivityLog };

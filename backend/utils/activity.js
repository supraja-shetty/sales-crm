const { ActivityLog } = require("../schemas/activitySchema");

async function logActivity({ user, action, entityType, entityId, description, metadata = {} }) {
  try {
    await ActivityLog.create({
      user: user?._id,
      userName: user?.name || "System",
      action,
      entityType,
      entityId,
      description,
      metadata
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
}

module.exports = logActivity;

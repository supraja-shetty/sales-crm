const { Notification } = require("../schemas/notificationSchema");

async function createMockNotification({ userId, type = "email", recipient, subject, message }) {
  return Notification.create({
    user: userId,
    type,
    recipient,
    subject,
    message,
    status: "MOCK_SENT"
  });
}

module.exports = createMockNotification;

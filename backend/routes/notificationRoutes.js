const router = require("express").Router();
const { list } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, list);
module.exports = router;

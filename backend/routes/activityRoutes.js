const router = require("express").Router();
const { list } = require("../controllers/activityController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), list);
module.exports = router;

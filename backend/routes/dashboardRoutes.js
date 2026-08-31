const router = require("express").Router();
const { summary } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, summary);
module.exports = router;

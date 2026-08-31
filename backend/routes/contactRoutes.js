const router = require("express").Router();
const controller = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", authorize("admin"), controller.remove);

module.exports = router;

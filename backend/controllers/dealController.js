const { Deal } = require("../schemas/dealSchema");
const { validate, dealSchema } = require("../validators");
const logActivity = require("../utils/activity");
const createMockNotification = require("../utils/notifications");

async function list(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filter = {};

  if (req.query.stage) filter.stage = req.query.stage;
  if (req.query.search) {
    filter.$or = [
      { title: new RegExp(req.query.search, "i") },
      { company: new RegExp(req.query.search, "i") }
    ];
  }

  const [items, total] = await Promise.all([
    Deal.find(filter)
      .populate("contact", "firstName lastName email company")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Deal.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

async function getOne(req, res) {
  const item = await Deal.findById(req.params.id)
    .populate("contact", "firstName lastName email company")
    .populate("assignedTo", "name");
  if (!item) return res.status(404).json({ message: "Deal not found" });
  res.json(item);
}

async function create(req, res) {
  const data = validate(dealSchema, req.body);
  if (!data.assignedTo) data.assignedTo = req.user._id;
  const item = await Deal.create({ ...data, createdBy: req.user._id });

  await logActivity({
    user: req.user,
    action: "CREATE",
    entityType: "Deal",
    entityId: item._id,
    description: `Created deal ${item.title}`
  });

  res.status(201).json(item);
}

async function update(req, res) {
  const data = validate(dealSchema, req.body);
  const before = await Deal.findById(req.params.id);
  if (!before) return res.status(404).json({ message: "Deal not found" });

  const item = await Deal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });

  await logActivity({
    user: req.user,
    action: "UPDATE",
    entityType: "Deal",
    entityId: item._id,
    description: `Updated deal ${item.title}`,
    metadata: { previousStage: before.stage, newStage: item.stage }
  });

  if (before.stage !== "Won" && item.stage === "Won") {
    await createMockNotification({
      userId: req.user._id,
      type: "email",
      recipient: item.contact?.email || "customer@example.com",
      subject: "Deal won",
      message: `Deal ${item.title} has been marked as Won.`
    });
  }

  res.json(item);
}

async function remove(req, res) {
  const item = await Deal.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Deal not found" });

  await logActivity({
    user: req.user,
    action: "DELETE",
    entityType: "Deal",
    entityId: item._id,
    description: `Deleted deal ${item.title}`
  });

  res.json({ message: "Deal deleted" });
}

module.exports = { list, getOne, create, update, remove };

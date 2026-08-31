const mongoose = require("mongoose");
const { Contact } = require("../schemas/contactSchema");
const { validate, contactSchema } = require("../validators");
const logActivity = require("../utils/activity");

async function list(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filter = {};

  if (req.query.search) {
    const q = req.query.search;
    filter.$or = [
      { firstName: new RegExp(q, "i") },
      { lastName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
      { company: new RegExp(q, "i") }
    ];
  }

  const [items, total] = await Promise.all([
    Contact.find(filter).populate("assignedTo", "name").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Contact.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

async function getOne(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid contact id" });
  const item = await Contact.findById(req.params.id).populate("assignedTo", "name");
  if (!item) return res.status(404).json({ message: "Contact not found" });
  res.json(item);
}

async function create(req, res) {
  const data = validate(contactSchema, req.body);
  if (!data.assignedTo) data.assignedTo = req.user._id;
  const item = await Contact.create({ ...data, createdBy: req.user._id });

  await logActivity({
    user: req.user,
    action: "CREATE",
    entityType: "Contact",
    entityId: item._id,
    description: `Created contact ${item.firstName} ${item.lastName || ""}`.trim()
  });

  res.status(201).json(item);
}

async function update(req, res) {
  const data = validate(contactSchema, req.body);
  const item = await Contact.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Contact not found" });

  await logActivity({
    user: req.user,
    action: "UPDATE",
    entityType: "Contact",
    entityId: item._id,
    description: `Updated contact ${item.firstName} ${item.lastName || ""}`.trim()
  });

  res.json(item);
}

async function remove(req, res) {
  const item = await Contact.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Contact not found" });

  await logActivity({
    user: req.user,
    action: "DELETE",
    entityType: "Contact",
    entityId: item._id,
    description: `Deleted contact ${item.firstName} ${item.lastName || ""}`.trim()
  });

  res.json({ message: "Contact deleted" });
}

module.exports = { list, getOne, create, update, remove };

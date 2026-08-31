const mongoose = require("mongoose");
const { Lead } = require("../schemas/leadSchema");
const { Contact } = require("../schemas/contactSchema");
const validate = require("../validators").validate;
const { leadSchema } = require("../validators");
const logActivity = require("../utils/activity");
const createMockNotification = require("../utils/notifications");

function queryFilter(req) {
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
  if (req.query.status) filter.status = req.query.status;
  if (req.query.source) filter.source = req.query.source;
  return filter;
}

async function list(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filter = queryFilter(req);
  const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Lead.find(filter).populate("assignedTo", "name email").sort(sort).skip((page - 1) * limit).limit(limit),
    Lead.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

async function getOne(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid lead id" });
  const item = await Lead.findById(req.params.id).populate("assignedTo", "name email");
  if (!item) return res.status(404).json({ message: "Lead not found" });
  res.json(item);
}

async function create(req, res) {
  const data = validate(leadSchema, req.body);
  if (!data.assignedTo) data.assignedTo = req.user._id;

  const item = await Lead.create({ ...data, createdBy: req.user._id });
  await logActivity({
    user: req.user,
    action: "CREATE",
    entityType: "Lead",
    entityId: item._id,
    description: `Created lead ${item.firstName} ${item.lastName || ""}`.trim()
  });

  await createMockNotification({
    userId: req.user._id,
    type: "email",
    recipient: item.email,
    subject: "New CRM lead created",
    message: `Lead ${item.firstName} has been added to the CRM.`
  });

  res.status(201).json(item);
}

async function update(req, res) {
  const data = validate(leadSchema, req.body);
  const item = await Lead.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Lead not found" });

  await logActivity({
    user: req.user,
    action: "UPDATE",
    entityType: "Lead",
    entityId: item._id,
    description: `Updated lead ${item.firstName} ${item.lastName || ""}`.trim()
  });

  res.json(item);
}

async function remove(req, res) {
  const item = await Lead.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Lead not found" });

  await logActivity({
    user: req.user,
    action: "DELETE",
    entityType: "Lead",
    entityId: item._id,
    description: `Deleted lead ${item.firstName} ${item.lastName || ""}`.trim()
  });

  res.json({ message: "Lead deleted" });
}

async function convert(req, res) {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });

  const existing = await Contact.findOne({ email: lead.email });
  if (existing) return res.status(409).json({ message: "A contact with this email already exists" });

  const contact = await Contact.create({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    sourceLead: lead._id,
    notes: lead.notes,
    assignedTo: lead.assignedTo || req.user._id,
    createdBy: req.user._id
  });

  lead.status = "Converted";
  await lead.save();

  await logActivity({
    user: req.user,
    action: "CONVERT",
    entityType: "Lead",
    entityId: lead._id,
    description: `Converted lead ${lead.firstName} into a contact`
  });

  res.status(201).json(contact);
}

module.exports = { list, getOne, create, update, remove, convert };

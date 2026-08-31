const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    sourceLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    notes: { type: String, maxlength: 1000 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = { Contact };

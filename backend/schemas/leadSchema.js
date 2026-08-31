const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true, maxlength: 120 },
    source: {
      type: String,
      enum: ["Website", "Referral", "Social Media", "Advertisement", "Cold Call", "Other"],
      default: "Website"
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Unqualified", "Converted"],
      default: "New"
    },
    notes: { type: String, maxlength: 1000 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = { Lead };

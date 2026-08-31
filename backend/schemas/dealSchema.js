const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    company: { type: String, trim: true },
    value: { type: Number, required: true, min: 0 },
    stage: {
      type: String,
      enum: ["New", "In Progress", "Won", "Lost"],
      default: "New"
    },
    expectedCloseDate: { type: Date },
    probability: { type: Number, min: 0, max: 100, default: 20 },
    notes: { type: String, maxlength: 1500 },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);
module.exports = { Deal };

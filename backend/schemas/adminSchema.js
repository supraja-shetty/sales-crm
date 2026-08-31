const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "admin"
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin };

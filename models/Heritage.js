const mongoose = require("mongoose");

// Har heritage record ko ek consistent shape me store karne ke liye schema.
const heritageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true, index: true },
    imageUrl: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

heritageSchema.index({ name: "text", location: "text", state: "text", category: "text" });

module.exports = mongoose.model("Heritage", heritageSchema);
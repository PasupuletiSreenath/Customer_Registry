const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Complaint description is required"],
    },
    category: {
      type: String,
      enum: ["product", "service", "billing", "technical", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "escalated", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);

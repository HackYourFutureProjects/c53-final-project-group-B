import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    taskType: {
      type: String,
      enum: ["delivery", "shopping", "smalljob"],
      required: true,
      default: "delivery",
    },
    price: { type: Number, required: true },
    pickupLocation: {
      address: { type: String, required: true },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
    dropoffLocation: {
      address: { type: String, required: true },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
    status: {
      type: String,
      enum: [
        "requested",
        "posted",
        "accepted",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "posted",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    requestedAt: { type: Date, default: null },
    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);
taskSchema.index({ "pickupLocation.location": "2dsphere" });
taskSchema.index({ "dropoffLocation.location": "2dsphere" });

const Task = mongoose.model("tasks", taskSchema);

export default Task;

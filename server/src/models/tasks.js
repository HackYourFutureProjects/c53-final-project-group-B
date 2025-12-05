import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    taskType: {
      type: String,
      enum: ["delivery", "shopping", "small job"],
      required: true,
      default: "delivery",
    },
    price: { type: Number, required: true },
    rated: { type: Boolean, default: false },
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
        "expired",
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
    declinedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    expiredAt: { type: Date, default: null },
    estimatedArrivalTime: { type: Date, default: null },
    repostedAt: { type: Date, default: null },
    acceptDeadLineMinutes: { type: Number, default: 10 },
  },
  { timestamps: true },
);
taskSchema.index({ "pickupLocation.location": "2dsphere" });
taskSchema.index({ "dropoffLocation.location": "2dsphere" });

const Task = mongoose.model("tasks", taskSchema);

export default Task;

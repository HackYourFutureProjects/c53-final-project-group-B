import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
      required: true,
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ratedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Rating = mongoose.model("ratings", ratingSchema);

export default Rating;

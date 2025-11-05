import Task from "../models/tasks.js";
import Rating from "../models/rating.js";
import User from "../models/User.js";

export const createRating = async (req, res) => {
  try {
    const { taskId, score, comment } = req.body;
    if (!taskId || !score) {
      return res
        .status(400)
        .json({ message: "Task ID and score are required" });
    }
    const task = await Task.findById(taskId);
    if (!task || task.status !== "completed") {
      return res
        .status(404)
        .json({ message: "Task not found or not completed" });
    }
    const existingRating = await Rating.findOne({ taskId });
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "Rating for this task already exists" });
    }
    const rating = await Rating.create({
      taskId,
      ratedBy: req.user._id,
      ratedTo: task.acceptedBy,
      rating: score,
      comment,
    });
    const courier = await User.findById(task.acceptedBy);
    const totalRatings = await Rating.find({ ratedTo: courier._id });
    const averageScore =
      totalRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings.length;
    courier.trustScore = averageScore.toFixed(2);
    await courier.save();
    res.status(201).json({ message: "Rating created successfully", rating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

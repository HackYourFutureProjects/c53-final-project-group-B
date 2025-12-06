import Task from "../models/tasks.js";
import Rating from "../models/rating.js";
import User from "../models/User.js";

export const createRating = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { score, comment } = req.body;
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
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to rate this task" });
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
      rating: parseInt(score, 10),
      comment,
    });
    task.rated = true;
    await task.save();
    const courier = await User.findById(task.acceptedBy);
    const totalRatings = await Rating.find({ ratedTo: courier._id });
    const averageScore =
      totalRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings.length;
    courier.trustScore = averageScore.toFixed(2);
    courier.taskTypes = courier.taskTypes.map((t) =>
      t === "small job" ? "smalljob" : t,
    );

    await courier.save();
    res.status(201).json({ message: "Rating created successfully", rating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

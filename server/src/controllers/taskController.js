import Task from "../models/tasks.js";
import User from "../models/User.js";
import { getCoordinates } from "../services/geoCodingService.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      taskType = undefined,
      price,
      pickupLocation,
      dropoffLocation,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !pickupLocation ||
      !dropoffLocation
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }
    const [pickupCoords, dropoffCoords] = await Promise.all([
      getCoordinates(pickupLocation),
      getCoordinates(dropoffLocation),
    ]);

    if (!pickupCoords || !dropoffCoords) {
      return res.status(400).json({
        success: false,
        msg: "Unable to geocode one or both addresses",
      });
    }
    await Task.create({
      title,
      description,
      createdBy: req.user._id,
      taskType,
      price,
      pickupLocation: {
        address: pickupLocation,
        location: {
          type: "Point",
          coordinates: [pickupCoords.lon, pickupCoords.lat],
        },
      },
      dropoffLocation: {
        address: dropoffLocation,
        location: {
          type: "Point",
          coordinates: [dropoffCoords.lon, dropoffCoords.lat],
        },
      },
    });
    res
      .status(201)
      .json({ success: true, message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    // Can accept both posted tasks and requested tasks
    if (task.status !== "posted" && task.status !== "requested") {
      return res.status(400).json({
        success: false,
        msg: "Task cannot be accepted in its current status",
      });
    }
    // If it was a requested task, verify it was requested to this courier
    if (
      task.status === "requested" &&
      task.requestedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        msg: "This task was not requested to you",
      });
    }
    task.status = "accepted";
    task.acceptedBy = req.user._id;
    task.acceptedAt = new Date();
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task accepted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    if (task.status !== "accepted") {
      return res.status(400).json({
        success: false,
        msg: "Task cannot be started in its current status",
      });
    }
    task.status = "in-progress";
    task.startedAt = new Date();
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task started successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    if (task.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        msg: "Task cannot be completed in its current status",
      });
    }
    task.status = "completed";
    task.completedAt = new Date();
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const cancelTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    if (task.status === "completed") {
      return res
        .status(400)
        .json({ success: false, msg: "Completed task cannot be canceled" });
    }
    if (task.status !== "posted") {
      return res.status(400).json({
        success: false,
        msg: "Only tasks that are not started can be canceled",
      });
    }
    task.status = "canceled";
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task canceled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const requestTaskToCourier = async (req, res) => {
  try {
    const {
      title,
      description,
      taskType = undefined,
      price,
      pickupLocation,
      dropoffLocation,
      requestedTo,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !pickupLocation ||
      !dropoffLocation ||
      !requestedTo
    ) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }
    const [pickupCoords, dropoffCoords] = await Promise.all([
      getCoordinates(pickupLocation),
      getCoordinates(dropoffLocation),
    ]);

    if (!pickupCoords || !dropoffCoords) {
      return res.status(400).json({
        success: false,
        msg: "Unable to geocode one or both addresses",
      });
    }
    await Task.create({
      title,
      description,
      createdBy: req.user._id,
      status: "requested",
      taskType,
      price,
      requestedTo,
      pickupLocation: {
        address: pickupLocation,
        location: {
          type: "Point",
          coordinates: [pickupCoords.lon, pickupCoords.lat],
        },
      },
      dropoffLocation: {
        address: dropoffLocation,
        location: {
          type: "Point",
          coordinates: [dropoffCoords.lon, dropoffCoords.lat],
        },
      },
    });
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const getMyTasks = async (req, res) => {
  try {
    if (req.user.role === "client") {
      const tasks = await Task.find({ createdBy: req.user._id }).populate(
        "acceptedBy",
      );
      res.status(200).json({ success: true, tasks });
    } else if (req.user.role === "courier") {
      // For couriers, get both accepted tasks and requested tasks
      const tasks = await Task.find({
        $or: [
          { acceptedBy: req.user._id },
          { requestedTo: req.user._id, status: "requested" },
        ],
      }).populate("createdBy");
      res.status(200).json({ success: true, tasks });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getAvailableTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const courier = await User.findById(userId);
    const coords = courier.location.coordinates;
    const hasLocation =
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number" &&
      coords[0] !== 0 &&
      coords[1] !== 0;

    const matchQuery = {
      status: "posted",
      taskType: { $in: courier.taskTypes },
      ...(courier.minPrice ? { price: { $gte: courier.minPrice } } : {}),
    };
    let tasks;
    if (hasLocation) {
      const [lon, lat] = coords;
      const pipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lon, lat] },
            key: "pickupLocation.location",
            distanceField: "distanceKm",
            spherical: true,
            distanceMultiplier: 0.001,
            ...(courier.maxDistance
              ? { maxDistance: courier.maxDistance * 1000 }
              : {}),
            query: matchQuery,
          },
        },
        {
          $addFields: {
            distanceKm: { $round: ["$distanceKm", 1] },
            distanceText: {
              $concat: [
                { $toString: { $round: ["$distanceKm", 1] } },
                " km away",
              ],
            },
          },
        },
        { $sort: { distanceKm: 1 } },
        { $limit: 30 },
      ];
      tasks = await Task.aggregate(pipeline);
    } else {
      tasks = await Task.find(matchQuery)
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
      tasks = tasks.map((t) => ({
        ...t,
        distanceKm: null,
        distanceText: "Unknown distance",
      }));
    }

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const getRequestedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ requestedTo: userId }).populate(
      "createdBy",
    );
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const declineTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    // Can only decline requested tasks
    if (task.status !== "requested") {
      return res.status(400).json({
        success: false,
        msg: "Only requested tasks can be declined",
      });
    }
    // Verify it was requested to this courier
    if (task.requestedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "This task was not requested to you",
      });
    }
    task.status = "posted";
    task.requestedTo = undefined;
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task declined successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

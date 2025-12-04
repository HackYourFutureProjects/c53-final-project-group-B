import Task from "../models/tasks.js";
import User from "../models/User.js";
import { getCoordinates } from "../services/geoCodingService.js";
//import transporter from "../util/mail.js";
import haversineDistance from "../util/distanceCalculator.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      taskType = undefined,
      price,
      pickupLocation,
      dropoffLocation,
      acceptDeadLineMinutes,
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
    const parsedMinutes = parseInt(acceptDeadLineMinutes, 10);
    const minutes = Math.min(Math.max(parsedMinutes || 10, 5), 15);
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
      expiredAt: new Date(Date.now() + minutes * 60 * 1000),
      acceptDeadLineMinutes: minutes,
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
    if (task.expiredAt && task.expiredAt < new Date()) {
      return res.status(400).json({
        success: false,
        msg: "Task acceptance time has expired",
      });
    }
    task.status = "accepted";
    task.acceptedBy = req.user._id;
    task.acceptedAt = new Date();
    await task.save();
    //const user = await User.findById(task.createdBy);
    //const courier = await User.findById(req.user._id);
    // Send email notification to the task creator
    /*try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your task has been accepted",
        text: `Your task "${task.title}" has been accepted by a courier (${courier.name}). To see the detail you can check your dashboard. They will contact you shortly to arrange the details. Thank you for using our service!`,
      });
    } catch {
      // Log the error but don't fail the whole request
    }*/

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
    const courier = await User.findById(task.acceptedBy);
    //const client = await User.findById(task.createdBy);
    if (task.status !== "accepted") {
      return res.status(400).json({
        success: false,
        msg: "Task cannot be started in its current status",
      });
    }
    task.status = "in-progress";
    task.startedAt = new Date();
    await task.save();
    // Estimate arrival time based on courier speed (e.g., 40 km/h)
    const courierCoords = courier.location.coordinates;
    const [pickupLon, pickupLat] = task.pickupLocation.location.coordinates;
    const distanceKm = haversineDistance(
      pickupLat,
      pickupLon,
      courierCoords[1],
      courierCoords[0],
    );
    const averageSpeedKmh = 40;
    const etaMinutes = Math.round((distanceKm / averageSpeedKmh) * 60);
    task.estimatedArrivalTime = new Date(Date.now() + etaMinutes * 60 * 1000);
    await task.save();
    /*try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: client.email,
        subject: "Your task is now in progress",
        text: `Your task "${task.title}" is now in progress. The courier (${courier.name}) is on their way to the pickup location. Estimated arrival time is approximately ${etaMinutes} minutes. Thank you for using our service!`,
      });
    } catch {
      // Log the error but don't fail the whole request
    }*/

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
    //const client = await User.findById(task.createdBy);
    //const courier = await User.findById(task.acceptedBy);
    /*try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: client.email,
        subject: "Your task has been completed",
        text: `Your task "${task.title}" has been completed. Thank you for using our service!`,
      });
    } catch {
      // Log the error but don't fail the whole request
    }*/

    /*try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: courier.email,
        subject: "Task completed",
        text: `The task "${task.title}" you accepted has been completed. and payment has been processed. Thank you for your service!`,
      });
    } catch {
      // Log the error but don't fail the whole request
    }*/
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
    if (task.status !== "posted" && task.status !== "requested") {
      return res.status(400).json({
        success: false,
        msg: "Only tasks that are not started can be canceled",
      });
    }
    task.status = "cancelled";
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task canceled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const repostTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    if (task.status !== "expired") {
      return res.status(400).json({
        success: false,
        msg: "Only expired tasks can be reposted",
      });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You can only repost your own tasks",
      });
    }
    task.status = "posted";
    task.repostedAt = new Date();
    task.expiredAt = new Date(
      Date.now() + task.acceptDeadLineMinutes * 60 * 1000,
    );
    task.requestedTo = undefined;
    task.declinedBy = [];
    await task.save();
    res
      .status(200)
      .json({ success: true, message: "Task reposted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const removeCancelledTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, msg: "Task not found" });
    }
    if (task.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        msg: "Only cancelled tasks can be removed",
      });
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You can only remove your own tasks",
      });
    }
    await Task.deleteOne({ _id: taskId });
    res
      .status(200)
      .json({ success: true, message: "Cancelled task removed successfully" });
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
      acceptDeadLineMinutes,
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
    const parsedMinutes = parseInt(acceptDeadLineMinutes, 10);
    const minutes = Math.min(Math.max(parsedMinutes || 10, 5), 15);
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
      expiredAt: new Date(Date.now() + minutes * 60 * 1000),
      acceptDeadLineMinutes: minutes,
    });
    // const courier = await User.findById(requestedTo);
    /*try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: courier.email,
        subject: "New Task Request",
        text: `You have a new task request: "${title}". Please check your dashboard for details.`,
      });
    } catch {
      // Log the error but don't fail the whole request
    }*/
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const getMyTasks = async (req, res) => {
  try {
    if (req.user.role === "client") {
      const tasks = await Task.find({ createdBy: req.user._id })
        .populate("acceptedBy")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, tasks });
    } else if (req.user.role === "courier") {
      // For couriers, get both accepted tasks and requested tasks
      const tasks = await Task.find({
        $or: [
          { acceptedBy: req.user._id },
          {
            requestedTo: req.user._id,
            status: "requested",
            declinedBy: { $ne: req.user._id },
          },
        ],
      })
        .populate("createdBy")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, tasks });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getMapTasks = async (req, res) => {
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

    // Build dynamic match query for map markers:
    // - Always include posted tasks
    // - Also include requested tasks that are specifically requested to this courier
    // - Only apply task type filter when courier preferences exist
    const statusFilter = {
      $or: [{ status: "posted" }, { status: "requested", requestedTo: userId }],
    };

    const taskTypeFilter =
      Array.isArray(courier.taskTypes) && courier.taskTypes.length > 0
        ? { taskType: { $in: courier.taskTypes } }
        : {};

    const priceFilter = courier.minPrice
      ? { price: { $gte: courier.minPrice } }
      : {};

    const matchQuery = {
      ...statusFilter,
      ...taskTypeFilter,
      ...priceFilter,
      declinedBy: { $ne: userId },
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
      ];
      tasks = await Task.aggregate(pipeline);
    } else {
      tasks = await Task.find(matchQuery).sort({ createdAt: -1 }).lean();
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

    // Build dynamic match query:
    // - Always include posted tasks (available to all couriers)
    // - Also include tasks assigned to this courier across lifecycle
    //   (accepted, in-progress, completed) so they don't disappear
    // - Only apply task type filter when courier preferences exist
    const statusFilter = {
      $or: [
        { status: "posted" },
        {
          status: { $in: ["accepted", "in-progress", "completed"] },
          acceptedBy: userId,
        },
      ],
    };

    const taskTypeFilter =
      Array.isArray(courier.taskTypes) && courier.taskTypes.length > 0
        ? { taskType: { $in: courier.taskTypes } }
        : {};

    const priceFilter = courier.minPrice
      ? { price: { $gte: courier.minPrice } }
      : {};

    const matchQuery = {
      ...statusFilter,
      ...taskTypeFilter,
      ...priceFilter,
      declinedBy: { $ne: userId },
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
      ];
      tasks = await Task.aggregate(pipeline);
    } else {
      tasks = await Task.find(matchQuery).sort({ createdAt: -1 }).lean();
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
    const tasks = await Task.find({
      requestedTo: userId,
      declinedBy: { $ne: userId },
    }).populate("createdBy");
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getMyRequestedTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({
      requestedTo: userId,
      status: "requested",
      declinedBy: { $ne: userId },
    }).populate("createdBy");
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
    // Allow declining requested (revert to posted) and posted (hide for this courier) tasks
    if (task.status === "requested") {
      // Verify it was requested to this courier
      if (task.requestedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          msg: "This task was not requested to you",
        });
      }
      task.status = "posted";
      task.requestedTo = undefined;
      task.expiredAt = new Date(
        Date.now() + task.acceptDeadLineMinutes * 60 * 1000,
      );
      if (
        !task.declinedBy?.some(
          (id) => id.toString() === req.user._id.toString(),
        )
      ) {
        task.declinedBy.push(req.user._id);
      }
      await task.save();
      return res.status(200).json({
        success: true,
        message: "Requested task declined and hidden from your view",
      });
    }

    if (task.status === "posted") {
      // Validate courier eligibility before allowing decline
      const courier = await User.findById(req.user._id);

      // Check if task matches courier's preferences
      const taskTypeMatches =
        !courier.taskTypes?.length || courier.taskTypes.includes(task.taskType);

      const priceMatches = !courier.minPrice || task.price >= courier.minPrice;

      if (!taskTypeMatches || !priceMatches) {
        return res.status(403).json({
          success: false,
          msg: "You don't have access to this task",
        });
      }

      // Check distance if courier has location and maxDistance preference
      if (courier.maxDistance && courier.location?.coordinates?.length === 2) {
        const [courierLon, courierLat] = courier.location.coordinates;
        const [taskLon, taskLat] = task.pickupLocation?.location
          ?.coordinates || [0, 0];

        if (
          courierLon !== 0 &&
          courierLat !== 0 &&
          taskLon !== 0 &&
          taskLat !== 0
        ) {
          // Calculate distance using Haversine formula
          const toRadians = (deg) => deg * (Math.PI / 180);
          const R = 6371; // Earth's radius in km
          const dLat = toRadians(taskLat - courierLat);
          const dLon = toRadians(taskLon - courierLon);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(courierLat)) *
              Math.cos(toRadians(taskLat)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance > courier.maxDistance) {
            return res.status(403).json({
              success: false,
              msg: "You don't have access to this task",
            });
          }
        }
      }

      // Task is valid for this courier, allow decline
      if (
        !task.declinedBy?.some(
          (id) => id.toString() === req.user._id.toString(),
        )
      ) {
        task.declinedBy.push(req.user._id);
      }
      await task.save();
      return res
        .status(200)
        .json({ success: true, message: "Task hidden from your view" });
    }

    return res.status(400).json({
      success: false,
      msg: "Only posted or requested tasks can be declined",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

import User from "../models/User.js";
import {
  getAddressFromCoordinates,
  getCoordinates,
} from "../services/geoCodingService.js";

export const updateUserCoordinates = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;

    if (latitude == null || longitude == null) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing coordinates" });
    }

    let locationName;
    const result = await getAddressFromCoordinates(latitude, longitude);
    if (result) {
      locationName = result.display_name;
    } else {
      locationName = "Unknown location";
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        address: locationName,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Coordinates updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getAvailableCouriers = async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await User.findById(userId);
    const coords = client.location.coordinates;
    const hasLocation =
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number" &&
      coords[0] !== 0 &&
      coords[1] !== 0;
    let couriers;
    const matchQuery = {
      role: "courier",
      isAvailable: true,
    };
    if (hasLocation) {
      const [lon, lat] = coords;

      const pipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lon, lat] },
            key: "location",
            distanceField: "distanceKm",
            spherical: true,
            distanceMultiplier: 0.001,
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
      couriers = await User.aggregate(pipeline);
    } else {
      couriers = await User.find(matchQuery).limit(30).lean();
    }

    res.status(200).json({ success: true, couriers });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "phone",
      "address",
      "taskTypes",
      "maxDistance",
      "minPrice",
      "profilePicture",
      "paymentMethod",
      "isAvailable",
    ];
    const updates = Object.keys(req.body);
    const isValid = updates.every((field) => allowedUpdates.includes(field));
    if (!isValid) {
      return res.status(400).json({ success: false, msg: "Invalid updates" });
    }

    // Handle payment method updates securely
    if (req.body.paymentMethod) {
      // Only store last 4 digits of card number for security
      if (req.body.paymentMethod.cardNumber) {
        const cardNumber = req.body.paymentMethod.cardNumber.replace(/\s/g, "");
        if (cardNumber.length >= 4) {
          req.body.paymentMethod.cardNumber =
            "**** **** **** " + cardNumber.slice(-4);
        }
      }
    }

    if (req.body.address) {
      const coords = await getCoordinates(req.body.address);
      if (coords) {
        req.body.location = {
          type: "Point",
          coordinates: [coords.lon, coords.lat],
        };
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "Unable to geocode the address" });
      }
    }

    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

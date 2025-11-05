import User from "../models/User.js";

export const updateUserCoordinates = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Missing coordinates" });
    }
    let locationName;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      const data = await response.json();
      locationName = data.display_name;
    } catch {
      locationName = "Unknown location";
    }
    await User.findByIdAndUpdate(userId, {
      address: locationName,
      location: {
        coordinates: [longitude, latitude],
      },
    });
    res.status(200).json({ message: "Coordinates updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
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
      typeof coords[1] === "number";
    let couriers;
    const matchQuery = {
      role: "courier",
    };
    if (hasLocation) {
      const [lon, lat] = coords;

      const pipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lon, lat] },
            key: "location.coordinates",
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
    res.status(200).json({ couriers });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

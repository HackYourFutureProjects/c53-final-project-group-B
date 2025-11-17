import axios from "axios";
export const getCoordinates = async (address) => {
  const fullAddress = address.includes("Netherlands")
    ? address
    : `${address}, Netherlands`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "TaskManager/1.0 (support@taskmanager.com)",
    },
  });
  const data = response.data[0];
  if (!data) return null;
  return {
    lat: parseFloat(data.lat),
    lon: parseFloat(data.lon),
  };
};

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "TaskManager/1.0 (support@taskmanager.com)",
      },
    });
    const data = response.data;
    if (!data) return null;
    return data;
  } catch (error) {
    return null;
  }
};

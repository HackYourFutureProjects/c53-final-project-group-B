import axios from "axios";
export const getCoordinates = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
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

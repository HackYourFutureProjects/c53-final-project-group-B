import L from "leaflet";

let mapInstance = null;
let markerGroup = null;
let resizeObserver = null;

export const initMap = async (
  containerOrId,
  lat = 52.37,
  lon = 4.89,
  zoom = 8,
) => {
  const container =
    typeof containerOrId === "string"
      ? document.getElementById(containerOrId)
      : containerOrId;

  if (!container) return;

  // Only initialize map once
  if (!mapInstance) {
    mapInstance = L.map(container).setView([lat, lon], zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapInstance);

    markerGroup = L.layerGroup().addTo(mapInstance);

    // Resize observer
    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(() => {
      mapInstance.invalidateSize();
    });
    resizeObserver.observe(container);
  } else {
    // just update view if map exists
    mapInstance.setView([lat, lon], zoom);
  }

  return mapInstance;
};

export const addMarker = (lat, lon, popupText = "") => {
  if (!mapInstance || !markerGroup) return;

  L.marker([lat, lon]).addTo(markerGroup).bindPopup(popupText);
};

export const clearMarkers = () => {
  if (markerGroup) markerGroup.clearLayers();
};

export const getMapInstance = () => mapInstance;

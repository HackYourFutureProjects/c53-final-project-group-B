// controller/mapcontroller.js
import L from "leaflet";

let mapInstance = null;
let markerGroup = null;

export const initMap = (containerOrId, lat = 52.37, lon = 4.89, zoom = 8) => {
  // allow passing either DOM element or id string
  const container =
    typeof containerOrId === "string" ? containerOrId : containerOrId; // pass-through if element

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // pass the container (id or element) to L.map
  mapInstance = L.map(container).setView([lat, lon], zoom);
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 100);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(mapInstance);
  window.addEventListener("resize", () => {
    if (mapInstance) mapInstance.invalidateSize();
  });

  markerGroup = L.layerGroup().addTo(mapInstance);

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

import L from "leaflet";
import { createRoot } from "react-dom/client";
import { createElement } from "react";

let mapInstance = null;
let markerGroup = null;
let resizeObserver = null;
let reactRoots = new Map();

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

export const addCourierMarker = (
  lat,
  lon,
  courier,
  PopupComponent,
  onRequestDelivery,
) => {
  if (!mapInstance || !markerGroup) return;

  // Create custom icon for courier
  const courierIcon = L.divIcon({
    className: "courier-marker",
    html: `<div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      cursor: pointer;
    ">${courier.name.charAt(0).toUpperCase()}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  const marker = L.marker([lat, lon], { icon: courierIcon }).addTo(markerGroup);

  // Create popup container
  const popupContainer = document.createElement("div");

  // Create React root and render component
  const root = createRoot(popupContainer);
  root.render(createElement(PopupComponent, { courier, onRequestDelivery }));

  // Bind popup to marker
  marker.bindPopup(popupContainer, {
    maxWidth: 320,
    minWidth: 280,
    className: "courier-popup",
  });

  // Store root for cleanup
  reactRoots.set(marker, root);

  return marker;
};

export const clearMarkers = () => {
  if (markerGroup) {
    // Cleanup all React roots
    reactRoots.forEach((root) => {
      root.unmount();
    });
    reactRoots.clear();

    markerGroup.clearLayers();
  }
};

export const getMapInstance = () => mapInstance;

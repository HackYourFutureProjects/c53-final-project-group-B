import L from "leaflet";
import { createRoot } from "react-dom/client";
import { createElement } from "react";

let mapInstance = null;
let markerGroup = null;
let resizeObserver = null;
let reactRoots = new Map();
let coordinateUsage = new Map();

const getCoordinateKey = (lat, lon) => `${lat.toFixed(5)},${lon.toFixed(5)}`;

const getOffsetLatLon = (lat, lon) => {
  const key = getCoordinateKey(lat, lon);
  const count = coordinateUsage.get(key) || 0;
  coordinateUsage.set(key, count + 1);

  if (count === 0) return [lat, lon];

  const offsetPatterns = [
    [0.00035, 0],
    [0, 0.00035],
    [-0.00035, 0],
    [0, -0.00035],
    [0.00028, 0.00028],
    [-0.00028, 0.00028],
    [-0.00028, -0.00028],
    [0.00028, -0.00028],
  ];
  const pattern = offsetPatterns[(count - 1) % offsetPatterns.length];
  const ring = Math.floor((count - 1) / offsetPatterns.length) + 1;

  return [lat + pattern[0] * ring, lon + pattern[1] * ring];
};

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

  if (mapInstance && !document.body.contains(mapInstance.getContainer())) {
    mapInstance.remove();
    mapInstance = null;
    markerGroup = null;
    reactRoots = new Map();
  }

  if (!mapInstance) {
    mapInstance = L.map(container).setView([lat, lon], zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapInstance);

    markerGroup = L.layerGroup().addTo(mapInstance);
    coordinateUsage = new Map();

    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(() => {
      mapInstance.invalidateSize();
    });
    resizeObserver.observe(container);
  } else {
    mapInstance.setView([lat, lon], zoom);
  }

  return mapInstance;
};

export const addMarker = (lat, lon, popupText = "") => {
  if (!mapInstance || !markerGroup) return;

  const taskIcon = L.divIcon({
    className: "task-marker",
    html: `<div style="
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    ">📦</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

  L.marker([lat, lon], { icon: taskIcon })
    .addTo(markerGroup)
    .bindPopup(popupText);
};

export const addTaskMarker = (lat, lon, task) => {
  if (!mapInstance || !markerGroup) return;

  const [adjustedLat, adjustedLon] = getOffsetLatLon(lat, lon);

  const taskIcon = L.divIcon({
    className: "task-marker",
    html: `<div style="
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    ">📦</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

  const isRequested = task.status === "requested";
  const badge = isRequested
    ? `<span style="
        display:inline-flex;align-items:center;gap:6px;padding:2px 8px;
        border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.2px;
        text-transform:uppercase;background:linear-gradient(135deg,#fde68a 0%,#f59e0b 100%);
        color:#1f2937;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 6px rgba(245,158,11,.25)
      ">⚑ Requested to you</span>`
    : "";

  const popupContent = `
    <div style="padding: 10px 12px; min-width: 220px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <h3 style="margin:0;font-size:16px;color:#111827;font-weight:700;">${task.title}</h3>
        ${badge}
      </div>
      <p style="margin:6px 0 8px 0; font-size:14px; color:#4b5563; line-height:1.35;">${task.description || ""}</p>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 10px;font-size:13px;color:#374151;">
        <div style="color:#6b7280;">Type</div><div>${task.taskType || "—"}</div>
        <div style="color:#6b7280;">Price</div><div>€${task.price}</div>
        ${task.distanceText ? `<div style="color:#6b7280;">Distance</div><div>${task.distanceText}</div>` : ""}
      </div>
    </div>
  `;

  const marker = L.marker([adjustedLat, adjustedLon], { icon: taskIcon })
    .addTo(markerGroup)
    .bindPopup(popupContent, {
      maxWidth: 280,
      minWidth: 220,
    });

  return marker;
};

export const addCourierMarker = (
  lat,
  lon,
  courier,
  PopupComponent,
  onRequestDelivery,
) => {
  if (!mapInstance || !markerGroup) return;

  const [adjustedLat, adjustedLon] = getOffsetLatLon(lat, lon);

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

  const marker = L.marker([adjustedLat, adjustedLon], {
    icon: courierIcon,
  }).addTo(markerGroup);

  const popupContainer = document.createElement("div");

  const root = createRoot(popupContainer);
  root.render(createElement(PopupComponent, { courier, onRequestDelivery }));

  marker.bindPopup(popupContainer, {
    maxWidth: 320,
    minWidth: 280,
    className: "courier-popup",
  });

  reactRoots.set(marker, root);

  return marker;
};

export const clearMarkers = () => {
  if (markerGroup) {
    reactRoots.forEach((root) => {
      root.unmount();
    });
    reactRoots.clear();

    markerGroup.clearLayers();
    coordinateUsage = new Map();
  }
};

export const getMapInstance = () => mapInstance;

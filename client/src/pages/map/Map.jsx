import { useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext.js";
import { initMap } from "../../controller/mapController.js";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";

const Map = () => {
  const { coordinates, locationReady } = useContext(UserContext);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!locationReady || !coordinates) return;

    let mapInitialized = false;

    const initializeMap = async () => {
      if (!mapRef.current || mapInitialized) return;

      await initMap(
        mapRef.current,
        coordinates.latitude,
        coordinates.longitude,
      );
      mapInitialized = true;
    };

    initializeMap();
  }, [locationReady, coordinates]);

  return <div id="map" className={styles.mapcontainer} ref={mapRef}></div>;
};

export default Map;

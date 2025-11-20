import { useEffect, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext.js";
import { initMap } from "../../controller/mapcontroller.js";
import "leaflet/dist/leaflet.css";
import styles from "./map.module.css";

const Map = () => {
  const { coordinates, locationReady } = useContext(UserContext);
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (!locationReady || !coordinates) return;

    if (!mapInitialized.current) {
      initMap("map", coordinates.latitude, coordinates.longitude);
      mapInitialized.current = true;
    }
  }, [locationReady, coordinates]);

  return <div id="map" className={styles.mapcontainer}></div>;
};

export default Map;

import { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import CourierCard from "./courierCard";
import { UserContext } from "../context/UserContext";
import styles from "./CourierList.module.css";
import {
  addMarker,
  clearMarkers,
  getMapInstance,
} from "../controller/mapcontroller";

const CouriersList = () => {
  const [couriers, setCouriers] = useState([]);
  const { locationReady } = useContext(UserContext);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/users/available-couriers",
    (data) => setCouriers(data.couriers),
  );
  useEffect(() => {
    if (!locationReady) return;
    performFetch();
    return () => {
      cancelFetch();
    };
  }, [locationReady]);

  useEffect(() => {
    if (!locationReady) return;

    const map = getMapInstance();
    if (!map) return;

    clearMarkers();

    couriers.forEach((courier) => {
      if (courier.location) {
        addMarker(
          courier.location.coordinates[1],
          courier.location.coordinates[0],
          courier.name,
        );
      }
    });
  }, [couriers, locationReady]);

  if (isLoading) {
    return <div>Loading available couriers...</div>;
  }

  if (error) {
    return <div>Error loading available couriers: {error}</div>;
  }
  /* couriers.forEach((courier) => {
    if (courier.location) {
      addMarker(
        courier.location.coordinates[1],
        courier.location.coordinates[0],
        courier.name,
      );
    }
  });*/

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Couriers</h2>

      {couriers.length === 0 ? (
        <p className={styles.empty}>No couriers available nearby.</p>
      ) : (
        <div className={styles.list}>
          {couriers.map((courier) => (
            <CourierCard key={courier._id} courier={courier} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CouriersList;

import { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import CourierMapPopup from "./CourierMapPopup";
import DeliveryRequestModal from "./DeliveryRequestModal";
import { UserContext } from "../context/UserContext";
import styles from "./CourierList.module.css";
import {
  addCourierMarker,
  clearMarkers,
  getMapInstance,
} from "../controller/mapcontroller";

const CouriersList = () => {
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
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

  const handleRequestDelivery = (courier) => {
    setSelectedCourier(courier);
  };

  const handleCloseModal = () => {
    setSelectedCourier(null);
  };

  const handleSuccessfulRequest = () => {
    // Optionally refresh courier list or show success message
    performFetch();
  };

  useEffect(() => {
    if (!locationReady) return;

    const map = getMapInstance();
    if (!map) return;

    clearMarkers();

    couriers.forEach((courier) => {
      if (courier.location) {
        addCourierMarker(
          courier.location.coordinates[1],
          courier.location.coordinates[0],
          courier,
          CourierMapPopup,
          handleRequestDelivery,
        );
      }
    });
  }, [couriers, locationReady]);

  if (isLoading) {
    return <div className={styles.loading}>Loading available couriers...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Error loading available couriers: {error}
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Available Couriers</h2>
        <p className={styles.subtitle}>
          Click on a courier marker on the map to request delivery
        </p>

        {couriers.length === 0 ? (
          <p className={styles.empty}>No couriers available nearby.</p>
        ) : (
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{couriers.length}</span>
              <span className={styles.statLabel}>Couriers Nearby</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {couriers.filter((c) => c.isAvailable).length}
              </span>
              <span className={styles.statLabel}>Available Now</span>
            </div>
          </div>
        )}
      </div>

      {selectedCourier && (
        <DeliveryRequestModal
          courier={selectedCourier}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulRequest}
        />
      )}
    </>
  );
};

export default CouriersList;

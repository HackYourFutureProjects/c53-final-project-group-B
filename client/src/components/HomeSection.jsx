import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js";
import CouriersList from "./Couriers.jsx";
import TaskList from "./TaskList.jsx";
import Map from "../pages/map/Map.jsx";
import GeneralDeliveryModal from "./GeneralDeliveryModal.jsx";
import styles from "./HomeSection.module.css";

const HomeSection = () => {
  const { user } = useContext(UserContext);
  const [showGeneralModal, setShowGeneralModal] = useState(false);

  if (!user) return null;

  const isClient = user.role === "client";

  const handleGeneralRequestSuccess = () => {};

  return (
    <div className={styles.homeContainer}>
      {isClient ? (
        <>
          <div className={styles.clientHeader}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.mapTitle}>Request a Delivery</h1>
                <p className={styles.mapSubtitle}>
                  Click on any courier marker to request from a specific courier
                </p>
              </div>
              <button
                className={styles.generalRequestButton}
                onClick={() => setShowGeneralModal(true)}
              >
                <span className={styles.buttonIcon}>📦</span>
                <span>Post General Request</span>
              </button>
            </div>
          </div>
          <div className={styles.clientContent}>
            <div className={styles.clientMapArea}>
              <Map />
            </div>
            <div className={styles.clientListArea}>
              <CouriersList />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.courierHeader}>
            <h1 className={styles.courierTitle}>Available & Requested Tasks</h1>
            <p className={styles.courierSubtitle}>
              View tasks on the map or browse the list
            </p>
          </div>
          <div className={styles.courierContent}>
            <div className={styles.courierMapArea}>
              <Map />
            </div>
            <div className={styles.courierListArea}>
              <TaskList />
            </div>
          </div>
        </>
      )}

      {showGeneralModal && (
        <GeneralDeliveryModal
          onClose={() => setShowGeneralModal(false)}
          onSuccess={handleGeneralRequestSuccess}
        />
      )}
    </div>
  );
};

export default HomeSection;

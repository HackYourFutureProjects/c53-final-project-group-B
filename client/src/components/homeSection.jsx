import CouriersList from "./Couriers.jsx";
import TaskList from "./taskList.jsx";
import Map from "../pages/map/map.jsx";
import GeneralDeliveryModal from "./GeneralDeliveryModal.jsx";
import styles from "./homeSection.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js";

const HomeSection = () => {
  const { user } = useContext(UserContext);
  const [showGeneralModal, setShowGeneralModal] = useState(false);

  if (!user) return null;

  const isClient = user.role === "client";

  const handleGeneralRequestSuccess = () => {
    // Optionally refresh or show success message
  };

  return (
    <div className={styles.homeContainer}>
      {isClient ? (
        // Client view: Full-width map with courier markers
        <div className={styles.fullMapContainer}>
          <div className={styles.mapHeader}>
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
          <div className={styles.fullMapArea}>
            <Map />
          </div>
          {/* Hidden component that still fetches and adds markers to map */}
          <div style={{ display: "none" }}>
            <CouriersList />
          </div>
        </div>
      ) : (
        // Courier view: Map on left, task list on right (existing layout)
        <>
          {!isClient && (
            <h1 className={styles.taskTitle}>Available & Requested Tasks</h1>
          )}
          <div className={styles.mapArea}>
            <Map />
          </div>
          <div className={styles.listArea}>
            <TaskList />
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

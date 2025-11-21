import CouriersList from "./Couriers.jsx";
import TaskList from "./taskList.jsx";
import Map from "../pages/map/map.jsx";
import styles from "./homeSection.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

const HomeSection = () => {
  const { user } = useContext(UserContext);

  if (!user) return null;

  const isClient = user.role === "client";

  return (
    <div className={styles.homeContainer}>
      {isClient ? (
        // Client view: Full-width map with courier markers
        <div className={styles.fullMapContainer}>
          <div className={styles.mapHeader}>
            <h1 className={styles.mapTitle}>Request a Delivery</h1>
            <p className={styles.mapSubtitle}>
              Click on any courier marker to view details and request delivery
            </p>
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
          <div className={styles.mapArea}>
            <Map />
          </div>
          <div className={styles.listArea}>
            <TaskList />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeSection;

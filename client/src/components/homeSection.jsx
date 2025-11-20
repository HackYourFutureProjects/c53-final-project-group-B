import CouriersList from "./Couriers.jsx";
import TaskList from "./taskList.jsx";
import Map from "../pages/map/map.jsx";
import styles from "./homeSection.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

const HomeSection = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.mapArea}>
        <Map />
      </div>
      <div className={styles.listArea}>
        {user.role === "client" ? <CouriersList /> : <TaskList />}
      </div>
    </div>
  );
};

export default HomeSection;

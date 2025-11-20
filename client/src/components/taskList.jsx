import { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import { UserContext } from "../context/UserContext.js";
import TaskCard from "./taskCard.jsx";
import styles from "./CourierList.module.css";
import {
  addMarker,
  clearMarkers,
  getMapInstance,
} from "../controller/mapcontroller.js";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { locationReady } = useContext(UserContext);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/tasks/availableTasks",
    (data) => setTasks(data.tasks),
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

    tasks.forEach((task) => {
      if (task.pickupLocation) {
        addMarker(
          task.pickupLocation.location.coordinates[1],
          task.pickupLocation.location.coordinates[0],
          task.title,
        );
      }
    });
  }, [tasks, locationReady]);
  if (isLoading) {
    return <div>Loading available tasks...</div>;
  }
  if (error) {
    return <div>Error loading available tasks: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Tasks</h1>
      {tasks.length === 0 ? (
        <p className={styles.empty}>No available tasks nearby.</p>
      ) : (
        <div className={styles.list}>
          {tasks.map((task) => {
            return (
              <TaskCard
                key={task._id}
                refreshAvailableTasks={performFetch}
                task={task}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TaskList;

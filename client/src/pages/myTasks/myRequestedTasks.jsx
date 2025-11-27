import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import styles from "../../components/CourierList.module.css";
import CardMyTask from "../../components/CardMyTask.jsx";

const MyRequestedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/tasks/my-requested",
    (data) => setTasks(data.tasks),
  );
  useEffect(() => {
    performFetch();
    return () => {
      cancelFetch();
    };
  }, []);
  if (isLoading) {
    return <div>Loading requested tasks...</div>;
  }
  if (error) {
    return <div>Error loading requested tasks: {error}</div>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Tasks</h1>
      {tasks.length === 0 ? (
        <p className={styles.empty}>No requested tasks.</p>
      ) : (
        <div className={styles.list}>
          {tasks.map((task) => {
            return (
              <CardMyTask
                key={task._id}
                refreshMyTasks={performFetch}
                task={task}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
export default MyRequestedTasks;

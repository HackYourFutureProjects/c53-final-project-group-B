import { useState, useEffect, useContext, useMemo } from "react";
import useFetch from "../../hooks/useFetch.js";
import styles from "../../components/CourierList.module.css";
import CardMyTask from "../../components/CardMyTask.jsx";
import { UserContext } from "../../context/UserContext.js";

const MyTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(UserContext);

  // Choose endpoint based on role:
  // - Couriers see available tasks
  // - Clients see their own orders
  const route = useMemo(() => {
    return user?.role === "courier"
      ? "/tasks/availableTasks"
      : "/tasks/my-tasks";
  }, [user?.role]);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    route,
    (data) => setTasks(data.tasks),
  );
  useEffect(() => {
    performFetch();
    return () => {
      cancelFetch();
    };
  }, []);
  if (isLoading) {
    return <div>Loading tasks...</div>;
  }
  if (error) {
    return <div>Error loading tasks: {error}</div>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {user?.role === "courier" ? "Tasks" : "My Orders"}
      </h1>
      {tasks.length === 0 ? (
        <p className={styles.empty}>
          {user?.role === "courier"
            ? "No tasks available."
            : "You have no orders yet."}
        </p>
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
export default MyTaskList;

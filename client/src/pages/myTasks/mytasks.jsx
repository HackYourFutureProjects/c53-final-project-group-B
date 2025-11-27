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

  // Filter tasks for couriers to show only accepted tasks
  const displayedTasks = useMemo(() => {
    if (user?.role === "courier") {
      return tasks.filter((task) =>
        ["accepted", "in-progress", "completed"].includes(task.status),
      );
    }
    return tasks;
  }, [tasks, user?.role]);

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
      {displayedTasks.length === 0 ? (
        <p className={styles.empty}>
          {user?.role === "courier"
            ? "No accepted tasks yet."
            : "You have no orders yet."}
        </p>
      ) : (
        <div className={styles.list}>
          {displayedTasks.map((task) => {
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

import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext.js";

const CardMyTask = ({ task, refreshMyTasks }) => {
  const { user } = useContext(UserContext);

  let buttonLabel = "";
  let action = "";

  if (user?.role === "client") {
    if (task.status === "posted") {
      buttonLabel = "Cancel";
      action = "cancel";
    }
  } else if (user?.role === "courier") {
    if (task.status === "accepted") {
      buttonLabel = "Start";
      action = "start";
    } else if (task.status === "in-progress") {
      buttonLabel = "Complete";
      action = "complete";
    }
  }

  const { performFetch, error } = useFetch(
    action ? `/tasks/${task._id}/${action}` : "",
    (data) => {
      alert(data.message);
      refreshMyTasks();
    },
  );

  useEffect(() => {
    if (error) alert("Error performing action: " + error);
  }, [error]);

  const handleButtonClick = () => {
    if (!action) return;
    performFetch({ method: "PUT" });
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.description}>{task.description}</p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`${styles.status} ${styles[task.status.replace("-", "_")]}`}
        >
          {task.status}
        </span>
      </p>

      <p>
        <strong>Type:</strong> {task.taskType}
      </p>
      <p>
        <strong>Price:</strong> €{task.price}
      </p>

      {task.pickupLocation?.address && (
        <p>
          <strong>Pickup:</strong> {task.pickupLocation.address}
        </p>
      )}

      {task.dropoffLocation?.address && (
        <p>
          <strong>Dropoff:</strong> {task.dropoffLocation.address}
        </p>
      )}

      {task.distanceText && <p>Distance: {task.distanceText}</p>}

      {user?.role === "client" && task.acceptedBy && (
        <div>
          <strong>Accepted By:</strong> {task.acceptedBy.name}
          <ul>
            <li>Email: {task.acceptedBy.email}</li>
            <li>Phone: {task.acceptedBy.phone}</li>
          </ul>
        </div>
      )}

      {user?.role === "courier" && task.createdBy && (
        <div>
          <strong>Created By:</strong> {task.createdBy.name}
          <ul>
            <li>Email: {task.createdBy.email}</li>
            <li>Phone: {task.createdBy.phone}</li>
          </ul>
        </div>
      )}

      {buttonLabel && (
        <button onClick={handleButtonClick} className={styles.acceptButton}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default CardMyTask;

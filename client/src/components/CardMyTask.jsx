import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

const CardMyTask = ({ task, refreshMyTasks }) => {
  const { user } = useContext(UserContext);
  let buttonLabel = "";
  let action = "";

  if (user.role === "client") {
    if (task.status === "posted") {
      buttonLabel = "Cancel";
      action = "cancel";
    }
    // Clients can’t act on other statuses
  } else if (user.role === "courier") {
    if (task.status === "accepted") {
      buttonLabel = "Start";
      action = "start";
    } else if (task.status === "in-progress") {
      buttonLabel = "Complete";
      action = "complete";
    }
    // No button if completed
  }

  const { performFetch, error } = useFetch(
    action ? `/tasks/${task._id}/${action}` : "",
    (data) => {
      alert(data.message);
      refreshMyTasks();
    },
  );
  if (error) {
    alert("Error performing action: " + error);
  }
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
      {user.role === "client" && (
        <p>
          acceptedBy:{task.acceptedBy?.name}
          <ul>
            <li>email: {task.acceptedBy?.email}</li>
            <li>phone: {task.acceptedBy?.phone}</li>
          </ul>
        </p>
      )}
      {user.role === "courier" && (
        <p>
          createdBy:{task.createdBy?.name}
          <ul>
            <li>email: {task.createdBy?.email}</li>
            <li>phone: {task.createdBy?.phone}</li>
          </ul>
        </p>
      )}
      {buttonLabel && (
        <button
          onClick={handleButtonClick}
          className={`${styles.acceptButton}`}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default CardMyTask;

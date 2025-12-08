import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import shortenAddress from "../controller/shortenAddress";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const TaskCard = ({ task, refreshAvailableTasks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { performFetch, error } = useFetch(
    `/tasks/${task._id}/accept`,
    (data) => {
      toast.success(data.message);
      refreshAvailableTasks();
      setIsLoading(false);
    },
  );
  useEffect(() => {
    if (error) {
      toast.error("Error accepting task: " + error);
    }
  }, [error]);

  function handleAccept() {
    setIsLoading(true);
    performFetch({ method: "PUT" });
  }
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{task.title}</h3>
        <span
          className={`${styles.status} ${styles[task.status.replace("-", "_")]}`}
        >
          {task.status}
        </span>
      </div>

      <p className={styles.description}>{task.description}</p>

      <div className={styles.infoGrid}>
        <p>
          <strong>Type:</strong> {task.taskType}
        </p>
        <p>
          <strong>Price:</strong> €{task.price}
        </p>
        <p>
          <strong>Expires at:</strong>{" "}
          {new Date(task.expiredAt).toLocaleString()}
        </p>
        <p>
          <strong>Created at:</strong>{" "}
          {task.repostedAt
            ? new Date(task.repostedAt).toLocaleString()
            : new Date(task.createdAt).toLocaleString()}
        </p>

        {task.distanceText && (
          <p>
            <strong>Distance:</strong> {task.distanceText}
          </p>
        )}
      </div>

      <div className={styles.locationBox}>
        {task.pickupLocation?.address && (
          <p>
            <strong>Pickup:</strong>{" "}
            {shortenAddress(task.pickupLocation.address)}
          </p>
        )}
        {task.dropoffLocation?.address && (
          <p>
            <strong>Dropoff:</strong>{" "}
            {shortenAddress(task.dropoffLocation.address)}
          </p>
        )}
      </div>

      <div className={styles.actionRow}>
        <button
          onClick={handleAccept}
          className={styles.acceptButton}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Accept"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

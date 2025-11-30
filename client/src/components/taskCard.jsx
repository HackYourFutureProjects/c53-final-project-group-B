import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import shortenAddress from "../controller/shortenAddress";
import { toast } from "react-toastify";

const TaskCard = ({ task, refreshAvailableTasks }) => {
  const { performFetch, error } = useFetch(
    `/tasks/${task._id}/accept`,
    (data) => {
      toast.success(data.message);
      refreshAvailableTasks();
    },
  );

  function handleAccept() {
    performFetch({ method: "PUT" });
    if (error) {
      toast.error("Error accepting task: " + error);
    }
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
        <button onClick={handleAccept} className={styles.acceptButton}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

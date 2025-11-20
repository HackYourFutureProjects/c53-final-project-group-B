import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import shortenAddress from "../controller/shortenAddress";

const TaskCard = ({ task, refreshAvailableTasks }) => {
  const { performFetch, error } = useFetch(
    `/tasks/${task._id}/accept`,
    (data) => {
      alert(data.message);
      refreshAvailableTasks();
    },
  );

  function handleAccept() {
    performFetch({ method: "PUT" });
    if (error) {
      alert("Error accepting task: " + error);
    }
  }
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
          <strong>Pickup:</strong> {shortenAddress(task.pickupLocation.address)}
        </p>
      )}

      {task.dropoffLocation?.address && (
        <p>
          <strong>Dropoff:</strong>{" "}
          {shortenAddress(task.dropoffLocation.address)}
        </p>
      )}
      {task.distanceText && <p>Distance: {task.distanceText}</p>}
      <button onClick={handleAccept} className={`${styles.acceptButton}`}>
        accept
      </button>
    </div>
  );
};

export default TaskCard;

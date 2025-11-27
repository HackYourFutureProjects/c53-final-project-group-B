import styles from "./TaskCard.module.css";
import useFetch from "../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.js";
import shortenAddress from "../controller/shortenAddress.js";

const CardMyTask = ({ task, refreshMyTasks }) => {
  const { user, token } = useContext(UserContext);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let primaryAction = null;
  let secondaryAction = null;

  if (user?.role === "client") {
    // Client actions
    if (task.status === "requested" || task.status === "posted") {
      primaryAction = { label: "Cancel", action: "cancel" };
    } else if (task.status === "completed" || task.status === "cancelled") {
      // Optionally add a "Remove" button to hide completed/cancelled tasks
      // primaryAction = { label: "Remove", action: "remove" };
    }
  } else if (user?.role === "courier") {
    // Courier actions
    if (task.status === "requested") {
      primaryAction = { label: "Accept", action: "accept" };
      secondaryAction = { label: "Decline", action: "decline" };
    } else if (task.status === "posted") {
      // Allow accepting or declining posted tasks from Tasks list
      primaryAction = { label: "Accept", action: "accept" };
      secondaryAction = { label: "Decline", action: "decline" };
    } else if (task.status === "accepted") {
      primaryAction = { label: "Start", action: "start" };
    } else if (task.status === "in-progress") {
      primaryAction = { label: "Complete", action: "complete" };
    }
  }

  const { performFetch, error } = useFetch(
    primaryAction ? `/tasks/${task._id}/${primaryAction.action}` : "",
    (data) => {
      alert(data.message);
      refreshMyTasks();
    },
  );

  const { performFetch: performSecondaryFetch, error: secondaryError } =
    useFetch(
      secondaryAction ? `/tasks/${task._id}/${secondaryAction.action}` : "",
      (data) => {
        alert(data.message);
        refreshMyTasks();
      },
    );

  useEffect(() => {
    if (error) alert("Error performing action: " + error);
  }, [error]);

  useEffect(() => {
    if (secondaryError) alert("Error performing action: " + secondaryError);
  }, [secondaryError]);

  const handlePrimaryAction = () => {
    if (!primaryAction) return;
    performFetch({ method: "PUT" });
  };

  const handleSecondaryAction = () => {
    if (!secondaryAction) return;
    performSecondaryFetch({ method: "PUT" });
  };

  const submitRating = async () => {
    if (!score) return alert("Please select a score");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ratings/${task._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, comment }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error submitting rating");

      alert("Rating submitted successfully");
      refreshMyTasks();
      setScore(5);
      setComment("");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
        <p className={styles.address}>
          <strong>Pickup:</strong> {shortenAddress(task.pickupLocation.address)}
        </p>
      )}

      {task.dropoffLocation?.address && (
        <p className={styles.address}>
          <strong>Dropoff:</strong>{" "}
          {shortenAddress(task.dropoffLocation.address)}
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

      <div className={styles.actionsContainer}>
        {primaryAction && (
          <button onClick={handlePrimaryAction} className={styles.acceptButton}>
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={handleSecondaryAction}
            className={styles.declineButton}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>

      {user?.role === "client" &&
        task.status === "completed" &&
        !task.rated && (
          <div className={styles.ratingContainer}>
            <h4>Rate this task</h4>
            <label>
              Score:
              <select
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
              />
            </label>
            <button
              onClick={submitRating}
              disabled={isSubmitting}
              className={styles.submitRatingButton}
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        )}
    </div>
  );
};

export default CardMyTask;

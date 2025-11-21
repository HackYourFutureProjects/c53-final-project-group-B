import { useState } from "react";
import styles from "./CourierMapPopup.module.css";
import shortenAddress from "../controller/shortenAddress";
import { logError } from "../util/logging.js";

const CourierMapPopup = ({ courier, onRequestDelivery }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = async () => {
    if (!onRequestDelivery) {
      logError("onRequestDelivery callback is not defined");
      return;
    }
    setIsRequesting(true);
    try {
      await onRequestDelivery(courier);
    } catch (error) {
      logError(error, { courierId: courier?.id });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.courierHeader}>
        <div className={styles.courierAvatar}>
          {courier.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.courierInfo}>
          <h3 className={styles.courierName}>{courier.name}</h3>
          <div className={styles.trustScoreContainer}>
            <span className={styles.star}>⭐</span>
            <span className={styles.trustScore}>
              {courier.trustScore > 0 ? courier.trustScore.toFixed(1) : "New"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.courierDetails}>
        {courier.distanceText && (
          <div className={styles.detailRow}>
            <span className={styles.icon}>📍</span>
            <span className={styles.detailText}>{courier.distanceText}</span>
          </div>
        )}

        {courier.address &&
          courier.address !== "" &&
          courier.address !== "Unknown location" && (
            <div className={styles.detailRow}>
              <span className={styles.icon}>🏠</span>
              <span className={styles.detailText}>
                {shortenAddress(courier.address)}
              </span>
            </div>
          )}

        <div className={styles.detailRow}>
          <span className={styles.icon}>
            {courier.isAvailable ? "✅" : "⏸️"}
          </span>
          <span className={styles.detailText}>
            {courier.isAvailable ? "Available Now" : "Not Available"}
          </span>
        </div>

        {courier.taskTypes && courier.taskTypes.length > 0 && (
          <div className={styles.detailRow}>
            <span className={styles.icon}>📦</span>
            <span className={styles.detailText}>
              {courier.taskTypes.join(", ")}
            </span>
          </div>
        )}
      </div>

      <button
        className={styles.requestButton}
        onClick={handleRequest}
        disabled={!courier.isAvailable || isRequesting}
      >
        {isRequesting ? (
          <span>Requesting...</span>
        ) : (
          <>
            <span className={styles.buttonIcon}>🚚</span>
            <span>Request Delivery</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CourierMapPopup;

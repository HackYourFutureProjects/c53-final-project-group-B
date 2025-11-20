import styles from "./CourierCard.module.css";
import shortenAddress from "../controller/shortenAddress.js";
const CourierCard = ({ courier }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{courier.name}</h3>
      <p>Trust Score: {courier.trustScore}</p>
      <p>Available: {courier.isAvailable ? "✅" : "❌"}</p>
      {courier.distanceText && <p>Distance: {courier.distanceText}</p>}
      {courier.address &&
        courier.address !== "" &&
        courier.address !== "Unknown location" && (
          <p className={styles.address}>
            Address: {shortenAddress(courier.address)}
          </p>
        )}
    </div>
  );
};
export default CourierCard;

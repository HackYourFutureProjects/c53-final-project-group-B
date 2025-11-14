import styles from "./CourierCard.module.css";
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
          <p>Address: {courier.address}</p>
        )}
    </div>
  );
};
export default CourierCard;

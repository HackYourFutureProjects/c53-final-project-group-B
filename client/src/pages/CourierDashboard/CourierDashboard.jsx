import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const CourierDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Courier Dashboard</h1>
      <p>Welcome{user?.name ? `, ${user.name}` : ""}!</p>
      <p>Your role: {user?.role || "unknown"}</p>
      <p>
        <address>
          <strong>Address:</strong> {user?.address || "unknown"}
        </address>
      </p>
      <p>
        This is a placeholder page — replace with the real courier dashboard UI.
      </p>
    </main>
  );
};

export default CourierDashboard;

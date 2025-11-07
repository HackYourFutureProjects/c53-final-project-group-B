import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const ClientDashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Client Dashboard</h1>
      <p>Welcome{user?.name ? `, ${user.name}` : ""}!</p>
      <p>Your role: {user?.role || "unknown"}</p>
      <p>
        This is a placeholder page — replace with the real client dashboard UI.
      </p>
    </main>
  );
};

export default ClientDashboard;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const RequireRole = ({ children, allowed = [] }) => {
  const { user } = useContext(UserContext) || {};

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    // Unauthorized: will be shown 403 page
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RequireRole;

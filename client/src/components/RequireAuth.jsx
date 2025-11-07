import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const RequireAuth = ({ children }) => {
  const ctx = useContext(UserContext) || {};
  const { user, token } = ctx;
  const location = useLocation();

  if (!user || !token) {
    // Redirect to login and preserve attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;

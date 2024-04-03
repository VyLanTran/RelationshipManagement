import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children, isAuthPage = false }) => {
  const { user } = useAuthContext();

  if (isAuthPage) return !user ? children : <Navigate to="/" />;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

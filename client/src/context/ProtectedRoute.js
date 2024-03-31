import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

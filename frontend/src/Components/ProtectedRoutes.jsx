import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

function ProtectedRoutes() {
  let { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;

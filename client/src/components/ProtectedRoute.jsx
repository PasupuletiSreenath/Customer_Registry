import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // ✅ include loading

  // ✅ WAIT until auth finishes loading
  if (loading) return <p>Loading...</p>;

  // ❌ Only check AFTER loading
  if (!user) return <Navigate to="/login" />;

  // ✅ Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

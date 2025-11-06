import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Verifica si el usuario está autenticado

  if (!token) {
    alert("Debes iniciar sesión para acceder a esta página.");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

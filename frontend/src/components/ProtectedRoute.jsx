import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const showLoginAlert = () => {
  Swal.fire({
    title: "Acceso restringido",
    text: "Debes iniciar sesión para acceder a esta página.",
    icon: "warning",
    confirmButtonText: "Ir al login"
  });
};

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    showLoginAlert();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;

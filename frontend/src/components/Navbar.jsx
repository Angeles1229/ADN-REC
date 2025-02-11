import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Swal from "sweetalert2"; 
import { AuthContext } from "../context/AuthContext";
import "../index.css";

const useAuth = () => useContext(AuthContext);

const showAlert = (title, text, icon, confirmButtonText) => {
  return Swal.fire({ title, text, icon, confirmButtonText });
};

const swalConfig = {
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
};

const Button = ({ onClick, to, children, className }) => {
  return to ? (
    <Link to={to} className={`button ${className}`}>{children}</Link>
  ) : (
    <button onClick={onClick} className={`button ${className}`}>{children}</button>
  );
};

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu sesión se cerrará y tendrás que volver a iniciar sesión.",
      icon: "warning",
      ...swalConfig,
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        showAlert("Sesión cerrada", "Has cerrado sesión correctamente.", "success", "Aceptar").then(() => {
          navigate("/login");
        });
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/genetico.png" className="logo-image" alt="Logo ADN-REC" />
        <h1 className="logo">ADN-REC</h1>
      </div>

      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">Inicio</Link>
        </li>
        {isAuthenticated && (
          <>
            <li className="nav-item">
              <Link to="/pacientes" className="nav-link">Pacientes</Link>
            </li>
            <li className="nav-item">
              <Link to="/enfermedades" className="nav-link">Enfermedades</Link>
            </li>
          </>
        )}
      </ul>

      <div className="auth-buttons">
        {isAuthenticated ? (
          <Button onClick={handleLogout} className="logout-button">Cerrar Sesión</Button>
        ) : (
          <>
            <Button to="/login" className="login-button">Login</Button>
            <Button to="/register" className="register-button">Register</Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

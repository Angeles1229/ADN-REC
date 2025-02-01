import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Swal from "sweetalert2"; 
import { AuthContext } from "../context/AuthContext";
import "../index.css";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu sesión se cerrará y tendrás que volver a iniciar sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Llama a la función de cierre de sesión
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar"
        }).then(() => {
          navigate("/login"); // Redirige al usuario al login después de la alerta
        });
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/genetico.png" alt="ADN-REC Logo" className="logo-image" />
        <h1 className="logo">ADN-REC</h1>
      </div>

      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">Inicio</Link>
        </li>
        {isAuthenticated && (
          <li className="nav-item">
            <Link to="/pacientes" className="nav-link">Pacientes</Link>
          </li>
        )}
      </ul>

      <div className="auth-buttons">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="button logout-button">
            Cerrar Sesión
          </button>
        ) : (
          <>
            <Link to="/login" className="button login-button">Login</Link>
            <Link to="/register" className="button register-button">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

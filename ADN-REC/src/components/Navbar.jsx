import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../index.css";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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

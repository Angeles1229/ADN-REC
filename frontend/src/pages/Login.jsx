import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto
import "../styles/login.css";
import Swal from "sweetalert2";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Obtiene la función login del contexto

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/laboratoristas/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Token recibido:", data.token);
        console.log("✅ ID del laboratorista recibido:", data.id); // ✅ Depuración del ID

        // Guardar token e ID del laboratorista en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("laboratorista_id", data.id); // ✅ Guardar el ID

        login(data.token); // Llama a la función login del contexto

        // Muestra SweetAlert2
        Swal.fire({
          title: "¡Éxito!",
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar"
        }).then(() => {
          navigate("/"); // Redirige después de cerrar la alerta
        });

      } else {
        setMessage(data.message || "Error en el inicio de sesión");
        Swal.fire({
          title: "Error",
          text: data.message || "Error en el inicio de sesión",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessage("Error al conectarse con el servidor");
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };

  return (
    <div className="bodyLogin">
      <h1>Inicio de Sesión</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <p className="register-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;

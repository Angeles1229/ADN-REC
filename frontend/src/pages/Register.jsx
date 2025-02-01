import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../styles/register.css";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/pacientes"); // Redirigir si ya está logueado
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/laboratoristas/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Muestra SweetAlert2 y redirige al login después de cerrarlo
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
          icon: "success",
          confirmButtonText: "Ir al Login"
        }).then(() => {
          navigate("/login"); // Redirige al usuario al login
        });

      } else {
        setMessage(data.message || "Error al registrarse");
        Swal.fire({
          title: "Error",
          text: data.message || "Error en el registro",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
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
    <div className="bodyRegister">
      <h1 className="register-title">Registro de Laboratorista🧪</h1>
      {message && <p className="register-message">{message}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Apellido:</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="form-input" />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="form-input" />
        </div>
        <p className="login-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
        <button type="submit" className="register-button2">Registrarse</button>
      </form>
      
    </div>
  );
}

export default Register;

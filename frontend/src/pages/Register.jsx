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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/pacientes");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para validar los campos
  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // Suponiendo que el teléfono tiene 10 dígitos
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Min 8 caracteres, al menos 1 letra y 1 número

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!formData.email.match(emailRegex)) newErrors.email = "Correo inválido.";
    if (!formData.password.match(passwordRegex)) newErrors.password = "La contraseña debe tener al menos 8 caracteres, incluir letras y números.";
    if (formData.telefono && !formData.telefono.match(phoneRegex)) newErrors.telefono = "El teléfono debe tener 10 dígitos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Detener el envío si hay errores

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/laboratoristas/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
          icon: "success",
          confirmButtonText: "Ir al Login",
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "Error en el registro",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="bodyRegister">
      <h1 className="register-title">Registro de Laboratorista🧪</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" />
          {errors.nombre && <p className="error-message">{errors.nombre}</p>}
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="form-input" />
          {errors.apellido && <p className="error-message">{errors.apellido}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="form-input" />
          {errors.telefono && <p className="error-message">{errors.telefono}</p>}
        </div>

        <p className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>

        <button type="submit" className="register-button2" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default Register;

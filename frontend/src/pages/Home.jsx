import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/home.css"; 

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [laboratorista, setLaboratorista] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Token almacenado en localStorage:", token); // 🔴 Verifica el token
  
    setIsAuthenticated(!!token);
  
    if (token) {
      fetch("http://localhost:4000/api/laboratoristas/perfil", { 
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 Datos recibidos del backend:", data); // 🔴 Verifica la respuesta del backend
        if (data.nombre) {
          setLaboratorista(`${data.nombre} ${data.apellido}`);
        }
      })
      .catch((err) => console.error("❌ Error al obtener el perfil:", err));
    }
  }, []);
  
  

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          Bienvenido {laboratorista ? laboratorista : ""} a <span>ADN-REC</span>
        </h1>
        <p className="hero-description">
          Descubre cómo nuestra tecnología puede ayudarte a analizar secuencias de ADN y detectar mutaciones genéticas.
        </p>
        <Link to={isAuthenticated ? "/pacientes" : "/login"} className="cta-button">
          {isAuthenticated ? "Ir a Pacientes" : "Comenzar ahora"}
        </Link>
      </div>
      <div className="features-section">
        <h2 className="features-title">¿Qué puedes hacer aquí?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src="/cadena-de-adn.png" alt="Análisis de ADN" className="feature-icon" />
            <h3>Analizar Secuencias de ADN</h3>
            <p>Sube archivos CSV con secuencias de ADN y obtén un análisis detallado.</p>
          </div>
          <div className="feature-item">
            <img src="/familia.png" alt="Gestión de pacientes" className="feature-icon" />
            <h3>Gestión de Pacientes</h3>
            <p>Administra información de pacientes y sus análisis genéticos.</p>
          </div>
          <div className="feature-item">
            <img src="/adn.png" alt="Detección de mutaciones" className="feature-icon" />
            <h3>Detección de Mutaciones</h3>
            <p>Identifica variaciones en el ADN y su posible relación con enfermedades.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

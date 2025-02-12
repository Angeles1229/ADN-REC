import React, { useState, useEffect } from "react";
import axios from "axios";
import EnfermedadItem from "./EnfermedadItem";
import EnfermedadForm from "./EnfermedadForm";
import Swal from "sweetalert2";
import "../styles/enfermedades.css";

const EnfermedadesList = () => {
  const [enfermedades, setEnfermedades] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnfermedad, setSelectedEnfermedad] = useState(null);

  useEffect(() => {
    fetchEnfermedades();
  }, []);

  const fetchEnfermedades = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/enfermedades");
      setEnfermedades(response.data);
    } catch (error) {
      console.error("Error al obtener enfermedades:", error);
      setError(error.message);
    }
  };

  return (
    <div className="enfermedades-container">
      <h2>Lista de Enfermedades</h2>

      
      <button onClick={() => { setShowModal(true); setSelectedEnfermedad(null); }} className="add-enfermedad-button">
        ➕ Agregar Enfermedad
      </button>

      {error && <p style={{ color: "red" }}>❌ Error al obtener datos: {error}</p>}

      
      <div className="enfermedades-grid">
        {enfermedades.length > 0 ? (
          enfermedades.map((enfermedad) => (
            <EnfermedadItem key={enfermedad.id} enfermedad={enfermedad} onEdit={() => { setSelectedEnfermedad(enfermedad); setShowModal(true); }} onDelete={fetchEnfermedades} />
          ))
        ) : (
          <p>No hay enfermedades registradas.</p>
        )}
      </div>

      
      {showModal && (
        <div className="enfermedad-modal">
          <div className="enfermedad-modal-content">
            <span className="close-button" onClick={() => setShowModal(false)}>✖</span>
            <EnfermedadForm closeModal={() => { setShowModal(false); fetchEnfermedades(); }} enfermedad={selectedEnfermedad} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnfermedadesList;

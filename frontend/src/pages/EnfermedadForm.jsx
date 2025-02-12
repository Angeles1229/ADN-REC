import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/enfermedades.css";

const EnfermedadForm = ({ closeModal, enfermedad }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    mutaciones_asociadas: "",
  });

  useEffect(() => {
    if (enfermedad) {
      setFormData(enfermedad);
    }
  }, [enfermedad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (enfermedad) {
        await axios.put(`http://localhost:4000/api/enfermedades/${enfermedad.id}`, formData);
        Swal.fire("✅ Actualizado", "La enfermedad ha sido actualizada correctamente.", "success");
      } else {
        await axios.post("http://localhost:4000/api/enfermedades", formData);
        Swal.fire("✅ Creado", "La enfermedad ha sido registrada correctamente.", "success");
      }
      closeModal(); 
    } catch (error) {
      console.error("Error al guardar la enfermedad:", error);
    }
  };

  return (
    <div className="enfermedad-modal">
      <div className="enfermedad-modal-content">
        <span className="close-button" onClick={closeModal}>✖</span>
        <h2>{enfermedad ? "Editar Enfermedad" : "Agregar Enfermedad"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
          <label>Descripción:</label>
          <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required />
          <label>Mutaciones Asociadas:</label>
          <textarea value={formData.mutaciones_asociadas} onChange={(e) => setFormData({ ...formData, mutaciones_asociadas: e.target.value })} required />
          <button type="submit" className="save-button">{enfermedad ? "Actualizar" : "Guardar"}</button>
        </form>
      </div>
    </div>
  );
};

export default EnfermedadForm;

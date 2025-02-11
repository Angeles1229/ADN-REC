import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/enfermedades.css";

const EnfermedadItem = ({ enfermedad, onEdit, onDelete }) => {
  const { id, nombre, descripcion, mutaciones_asociadas } = enfermedad;

  const handleDelete = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará "${nombre}" permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/enfermedades/${id}`);
          Swal.fire("Eliminado", "La enfermedad ha sido eliminada.", "success");
          onDelete(); // ✅ Actualiza la lista después de eliminar
        } catch (error) {
          console.error("Error al eliminar la enfermedad:", error);
        }
      }
    });
  };

  return (
    <div className="enfermedad-card">
      <h3>{nombre}</h3>
      <p><strong>Descripción:</strong> {descripcion}</p>
      <p><strong>Mutaciones Asociadas:</strong> {mutaciones_asociadas}</p>
      <button onClick={onEdit} className="edit-button">✏️ Editar</button>
      <button onClick={handleDelete} className="delete-button">🗑️ Eliminar</button>
    </div>
  );
};

export default EnfermedadItem;

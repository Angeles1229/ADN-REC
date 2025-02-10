import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import {
  getPacientesRequest,
  deletePaciente,
  updatePaciente,
  createPaciente,
  getHistorialADN
} from "../../api/paciente";
import PacienteForm from "./pacientesform";
import { useNavigate } from "react-router-dom";
import "../../styles/paciente.css";

function Paciente() {
  const [estado, setEstado] = useState({
    pacientes: [],
    filteredPacientes: [],
    searchTerm: "",
    editingPaciente: null,
    addingPaciente: false,
  });

  const navigate = useNavigate();

  // Función para cargar los pacientes
  const cargarPacientes = async () => {
    try {
      const response = await getPacientesRequest();
      setEstado((prev) => ({
        ...prev,
        pacientes: response,
        filteredPacientes: response,
      }));
    } catch (error) {
      console.error("Error al cargar los pacientes:", error);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setEstado((prev) => ({
      ...prev,
      searchTerm: term,
      filteredPacientes: prev.pacientes.filter((paciente) =>
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(term)
      ),
    }));
  };

  const handleVerHistorial = async (pacienteId) => {
    try {
      const historial = await getHistorialADN(pacienteId);

      if (!historial || historial.length === 0) {
        Swal.fire("Historial Vacío", "Este paciente no tiene registros de ADN.", "info");
        return;
      }

      const historialHTML = `<ul>${historial
        .map((entry) => `<li><b>${entry.fecha_subida}</b> - ${entry.enfermedad_detectada}</li>`)
        .join("")}</ul>`;

      Swal.fire({
        title: "Historial de Análisis ADN",
        html: historialHTML,
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      const errorMessage =
        error.response?.status === 404
          ? "Este paciente no tiene registros de ADN."
          : "No se pudo cargar el historial.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePaciente(id);
          await cargarPacientes();
          Swal.fire("Eliminado", "El paciente ha sido eliminado con éxito.", "success");
        } catch (error) {
          console.error("❌ Error al eliminar el paciente:", error);
          Swal.fire("Error", "No se pudo eliminar el paciente.", "error");
        }
      }
    });
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updatePaciente(id, updatedData);
      await cargarPacientes();
      setEstado((prev) => ({ ...prev, editingPaciente: null }));

      Swal.fire("Paciente actualizado", "Los datos han sido modificados correctamente.", "success");
    } catch (error) {
      console.error("Error al actualizar el paciente:", error);
      Swal.fire("Error", "No se pudo actualizar el paciente.", "error");
    }
  };

  const handleAddPaciente = async (newPaciente) => {
    try {
      await createPaciente(newPaciente);
      await cargarPacientes();
      setEstado((prev) => ({ ...prev, addingPaciente: false }));

      Swal.fire("Paciente agregado", "El paciente ha sido registrado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el paciente.", "error");
    }
  };

  return (
    <div className="bodyp">
      <h1>Lista de Pacientes</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={estado.searchTerm}
          onChange={handleSearch}
        />
        <button onClick={() => setEstado((prev) => ({ ...prev, addingPaciente: true }))}>
          Agregar Paciente
        </button>
      </div>

      <ul>
        {estado.filteredPacientes.map((paciente) => (
          <li key={paciente.id}>
            <span>
              {paciente.nombre} {paciente.apellido} - {paciente.edad} años
            </span>
            <div className="button-group">
              <button onClick={() => setEstado((prev) => ({ ...prev, editingPaciente: paciente }))}>
                Editar
              </button>
              <button onClick={() => handleDelete(paciente.id)}>Eliminar</button>
              <button onClick={() => navigate(`/analisis?paciente_id=${paciente.id}`)}>
                Ingresar ADN
              </button>
              <button onClick={() => handleVerHistorial(paciente.id)}>Ver Historial</button>
            </div>
          </li>
        ))}
      </ul>

      {estado.addingPaciente && (
        <div>
          <h2>Agregar Paciente</h2>
          <PacienteForm
            initialData={{ nombre: "", apellido: "", edad: "", genero: "" }}
            onSubmit={handleAddPaciente}
          />
        </div>
      )}

      {estado.editingPaciente && (
        <>
          <div className="overlay" onClick={() => setEstado((prev) => ({ ...prev, editingPaciente: null }))}></div>
          <div className="edit-form-container">
            <h2>Editar Paciente</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  nombre: e.target.nombre.value,
                  apellido: e.target.apellido.value,
                  edad: e.target.edad.value,
                  genero: e.target.genero.value,
                };
                handleUpdate(estado.editingPaciente.id, updatedData);
              }}
            >
              <input name="nombre" defaultValue={estado.editingPaciente.nombre} placeholder="Nombre" />
              <input name="apellido" defaultValue={estado.editingPaciente.apellido} placeholder="Apellido" />
              <input name="edad" defaultValue={estado.editingPaciente.edad} placeholder="Edad" type="number" />
              <select name="genero" defaultValue={estado.editingPaciente.genero}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">Guardar</button>
                <button className="cancel" onClick={() => setEstado((prev) => ({ ...prev, editingPaciente: null }))}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Paciente;

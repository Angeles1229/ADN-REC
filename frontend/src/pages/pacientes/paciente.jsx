import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { getPacientesRequest, deletePaciente, updatePaciente, createPaciente } from "../../api/paciente";
import PacienteForm from "./pacientesform";
import { useNavigate } from "react-router-dom";
import "../../styles/paciente.css";

function Paciente() {
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPaciente, setEditingPaciente] = useState(null);
  const [addingPaciente, setAddingPaciente] = useState(false);
  const [selectedPacienteForADN, setSelectedPacienteForADN] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPacientes() {
      try {
        const response = await getPacientesRequest();
        setPacientes(response);
        setFilteredPacientes(response);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      }
    }

    loadPacientes();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = pacientes.filter((paciente) =>
      `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
  };

  // Eliminar paciente con SweetAlert2
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
          setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
          setFilteredPacientes((prev) => prev.filter((paciente) => paciente.id !== id));

          Swal.fire("Eliminado", "El paciente ha sido eliminado con éxito.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el paciente.", "error");
        }
      }
    });
  };

  // Actualizar paciente con SweetAlert2
  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedPaciente = await updatePaciente(id, updatedData);
      setPacientes((prev) =>
        prev.map((paciente) =>
          paciente.id === id ? { ...paciente, ...updatedPaciente } : paciente
        )
      );
      setFilteredPacientes((prev) =>
        prev.map((paciente) =>
          paciente.id === id ? { ...paciente, ...updatedPaciente } : paciente
        )
      );
      setEditingPaciente(null);

      Swal.fire({
        title: "Paciente actualizado",
        text: "Los datos han sido modificados correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el paciente.", "error");
    }
  };

  // Agregar paciente con SweetAlert2
  const handleAddPaciente = async (newPaciente) => {
    try {
      const addedPaciente = await createPaciente(newPaciente);
      setPacientes((prev) => [...prev, addedPaciente]);
      setFilteredPacientes((prev) => [...prev, addedPaciente]);
      setAddingPaciente(false);

      Swal.fire({
        title: "Paciente agregado",
        text: "El paciente ha sido registrado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el paciente.", "error");
    }
  };

  // Seleccionar paciente para ingresar ADN
  const handleSelectPaciente = (paciente) => {
    navigate(`/analisis?paciente_id=${paciente.id}`);
  };

  return (
    <div className="bodyp">
      <h1>Lista de Pacientes</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={() => setAddingPaciente(true)}>Agregar Paciente</button>
      </div>

      <ul>
        {filteredPacientes.map((paciente) => (
          <li key={paciente.id}>
            <span>{paciente.nombre} {paciente.apellido} - {paciente.edad} años</span>
            <div className="button-group">
              <button onClick={() => setEditingPaciente(paciente)}>Editar</button>
              <button onClick={() => handleDelete(paciente.id)}>Eliminar</button>
              <button onClick={() => handleSelectPaciente(paciente)}>
                Ingresar ADN
              </button>
            </div>
          </li>
        ))}
      </ul>

      {addingPaciente && (
        <div>
          <h2>Agregar Paciente</h2>
          <PacienteForm
            initialData={{
              nombre: "",
              apellido: "",
              edad: "",
              genero: "",
            }}
            onSubmit={(newPaciente) => handleAddPaciente(newPaciente)}
          />
          <button onClick={() => setAddingPaciente(false)}>Cancelar</button>
        </div>
      )}

      {editingPaciente && (
        <>
          <div className="overlay" onClick={() => setEditingPaciente(null)}></div>
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
                handleUpdate(editingPaciente.id, updatedData);
              }}
            >
              <input name="nombre" defaultValue={editingPaciente.nombre} placeholder="Nombre" />
              <input name="apellido" defaultValue={editingPaciente.apellido} placeholder="Apellido" />
              <input name="edad" defaultValue={editingPaciente.edad} placeholder="Edad" type="number" />
              <select name="genero" defaultValue={editingPaciente.genero}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">Guardar</button>
                <button className="cancel" onClick={() => setEditingPaciente(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Paciente;

import { useEffect, useState } from "react";
import { getPacientesRequest, deletePaciente, updatePaciente, createPaciente } from "../../api/paciente";
import PacienteForm from "./pacientesform";
import { useNavigate } from "react-router-dom"; // Para redirigir
import "../../styles/paciente.css";


function Paciente() {
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPaciente, setEditingPaciente] = useState(null);
  const [addingPaciente, setAddingPaciente] = useState(false);
  const [selectedPacienteForADN, setSelectedPacienteForADN] = useState(null); // Estado para el ADN
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    async function loadPacientes() {
      try {
        const response = await getPacientesRequest();
        console.log("Pacientes cargados:", response);
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

  // Eliminar paciente
  const handleDelete = async (id) => {
    try {
      await deletePaciente(id);
      setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
      setFilteredPacientes((prev) =>
        prev.filter((paciente) => paciente.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar el paciente:", error);
    }
  };

  // Actualizar paciente
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
    } catch (error) {
      console.error("Error al actualizar el paciente:", error);
    }
  };

  // Agregar paciente
  const handleAddPaciente = async (newPaciente) => {
    try {
      console.log("📤 Intentando agregar paciente:", newPaciente);
      const addedPaciente = await createPaciente(newPaciente);
      setPacientes((prev) => [...prev, addedPaciente]);
      setFilteredPacientes((prev) => [...prev, addedPaciente]);
      setAddingPaciente(false);
      console.log("✅ Paciente agregado correctamente:", addedPaciente);
    } catch (error) {
      console.error("❌ Error al agregar el paciente:", error);
    }
  };

  // Seleccionar paciente para ingresar ADN
  const handleSelectPaciente = (paciente) => {
    navigate(`/analisis?paciente_id=${paciente.id}`);
  };

  // Guardar información de ADN (Ejemplo de función, puedes modificarla según el API)
  const handleSaveADN = (e) => {
    e.preventDefault();
    const adnData = e.target.adn.value;
    console.log(`ADN ingresado para ${selectedPacienteForADN.nombre}:`, adnData);

    // Aquí podrías enviar los datos al backend si es necesario
    setSelectedPacienteForADN(null); // Cerrar el formulario de ADN
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
              <input
                name="nombre"
                defaultValue={editingPaciente.nombre}
                placeholder="Nombre"
              />
              <input
                name="apellido"
                defaultValue={editingPaciente.apellido}
                placeholder="Apellido"
              />
              <input
                name="edad"
                defaultValue={editingPaciente.edad}
                placeholder="Edad"
                type="number"
              />
              <select name="genero" defaultValue={editingPaciente.genero}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">Guardar</button>
                <button className="cancel" onClick={() => setEditingPaciente(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {selectedPacienteForADN && (
        <div className="overlay">
          <div className="edit-form-container">
            <h2>Ingresar ADN para {selectedPacienteForADN.nombre}</h2>
            <form onSubmit={handleSaveADN}>
              <input name="adn" placeholder="Ingrese secuencia de ADN" required />
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit">Guardar</button>
                <button className="cancel" onClick={() => setSelectedPacienteForADN(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Paciente;

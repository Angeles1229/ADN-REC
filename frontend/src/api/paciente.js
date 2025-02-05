import axios from "axios";

const API_URL = "http://localhost:4000/api/pacientes"; // ✅ URL centralizada

// Obtener todos los pacientes
export const getPacientesRequest = async () => {
  const token = localStorage.getItem("token"); // ✅ Obtener token
  const laboratoristaId = localStorage.getItem("laboratorista_id"); // ✅ Obtener ID del laboratorista

  console.log("🔍 Token almacenado:", token);
  console.log("🔍 Laboratorista ID almacenado:", laboratoristaId);

  if (!laboratoristaId) {
    console.error("❌ No se encontró el laboratorista_id en localStorage");
    throw new Error("No se encontró el laboratorista_id en localStorage");
  }

  try {
    const response = await axios.get("http://localhost:4000/api/pacientes", {
      headers: { 
        Authorization: `Bearer ${token}`, 
        laboratorista_id: laboratoristaId  // ✅ Asegurar que se envía correctamente
      },
    });

    console.log("✅ Pacientes recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener los pacientes:", error.response?.data || error);
    throw error;
  }
};



// Crear un paciente (con headers correctos)
export const createPaciente = async (paciente) => {
  try {
    const laboratoristaId = localStorage.getItem("laboratorista_id"); // ✅ Obtener ID del laboratorista

    if (!laboratoristaId) {
      console.error("❌ No se encontró el laboratorista_id en localStorage");
      throw new Error("No se encontró el laboratorista_id en localStorage");
    }

    const pacienteData = { ...paciente, laboratorista_id: laboratoristaId }; // ✅ Agregar el ID

    console.log("📤 Enviando datos a createPaciente:", pacienteData);

    const response = await axios.post(API_URL, pacienteData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el paciente:", error.response?.data || error);
    throw error;
  }
};


// Actualizar un paciente
export const updatePaciente = async (id, data) => {
  try {
      const response = await fetch(`http://localhost:4000/api/pacientes/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error(`Error en la actualización: ${response.statusText}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error en updatePaciente:", error);
      throw error;
  }
};


// Eliminar un paciente
export const deletePaciente = async (id) => {
  try {
    const token = localStorage.getItem("token"); 
    const laboratoristaId = localStorage.getItem("laboratorista_id"); 

    if (!laboratoristaId) {
      console.error("❌ No se encontró el laboratorista_id en localStorage");
      throw new Error("ID del laboratorista no válido.");
    }

    await axios.delete(`http://localhost:4000/api/pacientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        laboratorista_id: laboratoristaId, // ✅ Asegurar que se envía
      },
    });

    console.log(`✅ Paciente con ID ${id} eliminado correctamente.`);
  } catch (error) {
    console.error("❌ Error al eliminar el paciente:", error.response?.data || error);
    throw error;
  }
};

export const getHistorialADN = async (pacienteId) => {
  const response = await axios.get(`http://localhost:4000/api/analisis/historial_adn/${pacienteId}`);
  return response.data;
};


import axios from "axios";

const API_URL = "http://localhost:4000/api/pacientes"; // ✅ URL centralizada

// Obtener todos los pacientes
export const getPacientesRequest = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear un paciente (con headers correctos)
export const createPaciente = async (paciente) => {
  try {
    console.log("📤 Enviando datos a createPaciente:", paciente); // ✅ Depuración
    const response = await axios.post(API_URL, paciente, {
      headers: { "Content-Type": "application/json" } // ✅ Asegura que el backend pueda leer los datos
    });
    console.log("✅ Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el paciente:", error.response?.data || error);
    throw error;
  }
};

// Actualizar un paciente
export const updatePaciente = async (id, paciente) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, paciente);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el paciente:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un paciente
export const deletePaciente = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error al eliminar el paciente:", error.response?.data || error.message);
    throw error;
  }
};

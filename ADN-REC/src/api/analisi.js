import axios from "axios";

const API_URL = "http://localhost:4000/api/analisis"; // ✅ Ajustado al nuevo backend
const API_PACIENTES_URL = "http://localhost:4000/api/pacientes"; // ✅ Nueva URL para pacientes

// 🔹 Obtener los datos de un paciente por ID
export const getPacienteById = async (id) => {
    try {
        const response = await axios.get(`${API_PACIENTES_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el paciente con ID ${id}:`, error);
        throw error;
    }
};

// 🔹 Subir archivo CSV para análisis de ADN
export const subirArchivoADN = async (file, paciente_id) => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("paciente_id", paciente_id);

    try {
        const response = await axios.post(`${API_URL}/subir-adn`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error al subir el archivo de ADN:", error);
        throw error;
    }
};

// 🔹 Obtener los análisis de ADN almacenados
export const getAnalisisADN = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los análisis de ADN:", error);
        throw error;
    }
};

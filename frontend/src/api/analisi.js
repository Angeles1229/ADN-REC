import axios from "axios";

const BASE_URL = "http://localhost:4000/api"; 
const API_URL = `${BASE_URL}/analisis`;
const API_PACIENTES_URL = `${BASE_URL}/pacientes`;


const getLaboratoristaId = () => {
    const id = localStorage.getItem("laboratorista_id");
    if (!id) {
        console.error("❌ No se encontró el laboratorista_id en localStorage");
        throw new Error("No se encontró laboratorista_id en el almacenamiento.");
    }
    return id;
};


export const getPacienteById = async (id) => {
    try {
        const laboratoristaId = getLaboratoristaId();

        const response = await axios.get(`${API_PACIENTES_URL}/${id}`, {
            headers: { laboratorista_id: laboratoristaId }
        });

        console.log("✅ Paciente encontrado:", response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error al obtener el paciente con ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};


export const subirArchivoADN = async (file, pacienteId) => {
    try {
        const formData = new FormData();
        formData.append("archivo", file);
        formData.append("paciente_id", pacienteId);

        const response = await axios.post(`${API_URL}/subir-adn`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Archivo de ADN subido:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al subir el archivo de ADN:", error.response?.data || error.message);
        throw error;
    }
};


export const getAnalisisADN = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("✅ Análisis ADN obtenidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los análisis de ADN:", error.response?.data || error.message);
        throw error;
    }
};

import axios from "axios";

const BASE_URL = "http://localhost:4000/api"; 
const API_URL = `${BASE_URL}/pacientes`;


const getLaboratoristaId = () => {
    const id = localStorage.getItem("laboratorista_id");
    if (!id) {
        console.error("❌ No se encontró el laboratorista_id en localStorage");
        throw new Error("No se encontró el laboratorista_id en localStorage");
    }
    return id;
};


const getToken = () => localStorage.getItem("token");


export const getPacientesRequest = async () => {
    try {
        const token = getToken();
        const laboratoristaId = getLaboratoristaId();

        const response = await axios.get(API_URL, {
            headers: { 
                Authorization: `Bearer ${token}`,
                laboratorista_id: laboratoristaId
            },
        });

        console.log("✅ Pacientes recibidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los pacientes:", error.response?.data || error.message);
        throw error;
    }
};


export const createPaciente = async (paciente) => {
    try {
        const laboratoristaId = getLaboratoristaId();

        const pacienteData = { ...paciente, laboratorista_id: laboratoristaId };

        console.log("📤 Enviando datos a createPaciente:", pacienteData);

        const response = await axios.post(API_URL, pacienteData, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al crear el paciente:", error.response?.data || error.message);
        throw error;
    }
};


export const updatePaciente = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Paciente actualizado:", response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error en updatePaciente (ID ${id}):`, error.response?.data || error.message);
        throw error;
    }
};


export const deletePaciente = async (id) => {
    try {
        const token = getToken();
        const laboratoristaId = getLaboratoristaId();

        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                laboratorista_id: laboratoristaId,
            },
        });

        console.log(`✅ Paciente con ID ${id} eliminado correctamente.`);
    } catch (error) {
        console.error(`❌ Error al eliminar el paciente (ID ${id}):`, error.response?.data || error.message);
        throw error;
    }
};

e
export const getHistorialADN = async (pacienteId) => {
    try {
        const response = await axios.get(`${BASE_URL}/analisis/historial_adn/${pacienteId}`);
        console.log("✅ Historial ADN recibido:", response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Error al obtener el historial ADN (Paciente ID ${pacienteId}):`, error.response?.data || error.message);
        throw error;
    }
};

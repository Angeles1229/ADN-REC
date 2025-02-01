import { PacienteModel, LaboratoristaModel } from "../models/ADNModels.js";

// 🔹 Obtener todos los pacientes
export const getPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.findAll();
    res.json(pacientes);
  } catch (error) {
    console.error("Error en getPacientes:", error);
    res.status(500).json({ message: "Error al obtener los pacientes", error });
  }
};

// 🔹 Obtener un paciente por ID
export const getPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await PacienteModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el paciente", error });
  }
};

// 🔹 Crear un nuevo paciente
export const createPaciente = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en createPaciente:", req.body);

    const { nombre, apellido, edad, genero, laboratorista_id } = req.body;

    // 1️⃣ **Validar datos obligatorios**
    if (!nombre || !apellido || !edad || !genero || !laboratorista_id) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // 2️⃣ **Convertir `laboratorista_id` a número y validar**
    const laboratoristaID = parseInt(laboratorista_id);
    if (isNaN(laboratoristaID)) {
      return res.status(400).json({ message: "ID de laboratorista no válido." });
    }

    // 3️⃣ **Verificar si el laboratorista existe**
    const laboratorista = await LaboratoristaModel.findByPk(laboratoristaID);
    if (!laboratorista) {
      return res.status(404).json({ message: "Laboratorista no encontrado." });
    }

    // 4️⃣ **Crear el paciente con `laboratorista_id` válido**
    const paciente = await PacienteModel.create({
      nombre,
      apellido,
      edad,
      genero,
      laboratorista_id: laboratoristaID, // ✅ Asociamos correctamente el laboratorista
    });

    console.log("✅ Paciente creado:", paciente);
    res.status(201).json(paciente);
  } catch (error) {
    console.error("❌ Error al crear el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// 🔹 Actualizar un paciente
export const updatePaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, genero } = req.body;
  try {
    const paciente = await PacienteModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    await paciente.update({ nombre, apellido, edad, genero });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el paciente", error });
  }
};

// 🔹 Eliminar un paciente
export const deletePaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await PacienteModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    await paciente.destroy();
    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el paciente", error });
  }
};

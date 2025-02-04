import { PacienteModel, LaboratoristaModel } from "../models/ADNModels.js";

// 🔹 Obtener pacientes del laboratorista autenticado
export const getPacientes = async (req, res) => {
  try {
    console.log("📥 Headers recibidos en getPacientes:", req.headers);

    const laboratoristaID = parseInt(req.headers["laboratorista_id"]);

    if (!laboratoristaID || isNaN(laboratoristaID)) {
      console.error("❌ ID del laboratorista no válido o faltante:", laboratoristaID);
      return res.status(400).json({ message: "ID del laboratorista no válido o faltante." });
    }

    const pacientes = await PacienteModel.findAll({
      where: { laboratorista_id: laboratoristaID },
    });

    console.log("✅ Pacientes obtenidos:", pacientes);
    res.json(pacientes);
  } catch (error) {
    console.error("❌ Error en getPacientes:", error);
    res.status(500).json({ message: "Error al obtener los pacientes", error });
  }
};


// 🔹 Obtener un paciente por ID (validando que pertenezca al laboratorista)
export const getPaciente = async (req, res) => {
  const { id } = req.params;
  const laboratoristaID = parseInt(req.headers["laboratorista_id"]); // ⬅️ Obtener desde headers

  try {
    const paciente = await PacienteModel.findOne({
      where: { id, laboratorista_id: laboratoristaID },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado o no autorizado." });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el paciente", error });
  }
};

// 🔹 Crear un nuevo paciente asegurando que pertenece al laboratorista autenticado
export const createPaciente = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en createPaciente:", req.body);

    const { nombre, apellido, edad, genero, laboratorista_id } = req.body;
    const laboratoristaID = parseInt(laboratorista_id); // ⬅️ Ahora lo toma del body

    // 1️⃣ **Validar datos obligatorios**
    if (!nombre || !apellido || !edad || !genero || !laboratoristaID) {
      console.error("❌ Faltan datos obligatorios:", { nombre, apellido, edad, genero, laboratoristaID });
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // 2️⃣ **Verificar si el laboratorista existe**
    const laboratorista = await LaboratoristaModel.findByPk(laboratoristaID);
    if (!laboratorista) {
      console.error("❌ Laboratorista no encontrado:", laboratoristaID);
      return res.status(404).json({ message: "Laboratorista no encontrado." });
    }

    // 3️⃣ **Crear el paciente**
    const paciente = await PacienteModel.create({
      nombre,
      apellido,
      edad,
      genero,
      laboratorista_id: laboratoristaID,
    });

    console.log("✅ Paciente creado con éxito:", paciente);
    res.status(201).json(paciente);
  } catch (error) {
    console.error("❌ Error al crear el paciente:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};


// 🔹 Actualizar un paciente (solo si pertenece al laboratorista autenticado)
export const updatePaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, genero } = req.body;
  const laboratoristaID = parseInt(req.headers["laboratorista_id"]); // ⬅️ Obtener desde headers

  try {
    const paciente = await PacienteModel.findOne({
      where: { id, laboratorista_id: laboratoristaID },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado o no autorizado." });
    }

    await paciente.update({ nombre, apellido, edad, genero });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el paciente", error });
  }
};

// 🔹 Eliminar un paciente (solo si pertenece al laboratorista autenticado)
export const deletePaciente = async (req, res) => {
  const { id } = req.params;
  const laboratoristaID = parseInt(req.headers["laboratorista_id"]); // ⬅️ Obtener desde headers

  try {
    const paciente = await PacienteModel.findOne({
      where: { id, laboratorista_id: laboratoristaID },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado o no autorizado." });
    }

    await paciente.destroy();
    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el paciente", error });
  }
};

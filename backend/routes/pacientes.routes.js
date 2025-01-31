import { Router } from "express";
import {
    getPaciente,
    createPaciente,
    deletePaciente,  // ✅ Corregido (antes deletePacientes)
    updatePaciente,  // ✅ Corregido (antes updatePacientes)
    getPacientes
} from "../controllers/pacienteController.js";

const router = Router();

// 🔹 Rutas de Pacientes
router.get("/", getPacientes); // Obtener todos los pacientes
router.get("/:id", getPaciente); // Obtener un paciente por ID
router.post("/", createPaciente); // Crear un paciente
router.put("/:id", updatePaciente); // Actualizar paciente
router.delete("/:id", deletePaciente); // Eliminar paciente

export default router;

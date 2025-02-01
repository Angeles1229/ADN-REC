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
router.get("/", verifyToken, getPacientes); // 🔹 Protegemos la ruta con el middleware
router.post("/", createPaciente); // Crear un paciente
router.put("/:id", updatePaciente); // Actualizar paciente
router.delete("/:id", deletePaciente); // Eliminar paciente

export default router;

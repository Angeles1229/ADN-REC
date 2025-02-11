import express from "express";
import {
    getEnfermedades,
    getEnfermedadById,
    createEnfermedad,
    updateEnfermedad,
    deleteEnfermedad
} from "../controllers/enfermedadController.js";

const router = express.Router();

router.get("/enfermedades", getEnfermedades); // Obtener todas
router.get("/enfermedades/:id", getEnfermedadById); // Obtener una por ID
router.post("/enfermedades", createEnfermedad); // Crear
router.put("/enfermedades/:id", updateEnfermedad); // Actualizar
router.delete("/enfermedades/:id", deleteEnfermedad); // Eliminar

export default router;

import express from "express";
import {
    getEnfermedades,
    getEnfermedadById,
    createEnfermedad,
    updateEnfermedad,
    deleteEnfermedad
} from "../controllers/enfermedadController.js";

const router = express.Router();

router.get("/enfermedades", getEnfermedades); 
router.get("/enfermedades/:id", getEnfermedadById); 
router.post("/enfermedades", createEnfermedad); 
router.put("/enfermedades/:id", updateEnfermedad); 
router.delete("/enfermedades/:id", deleteEnfermedad); 

export default router;

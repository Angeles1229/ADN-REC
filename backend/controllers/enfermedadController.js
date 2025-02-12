import { EnfermedadModel } from "../models/ADNModels.js"; 


export const getEnfermedades = async (req, res) => {
    try {
        const enfermedades = await EnfermedadModel.findAll();
        res.json(enfermedades);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las enfermedades", error });
    }
};


export const getEnfermedadById = async (req, res) => {
    try {
        const enfermedad = await EnfermedadModel.findByPk(req.params.id);
        if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });
        res.json(enfermedad);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la enfermedad", error });
    }
};


export const createEnfermedad = async (req, res) => {
    try {
        const { nombre, descripcion, mutaciones_asociadas } = req.body;
        const nuevaEnfermedad = await EnfermedadModel.create({ nombre, descripcion, mutaciones_asociadas });
        res.status(201).json(nuevaEnfermedad);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la enfermedad", error });
    }
};


export const updateEnfermedad = async (req, res) => {
    try {
        const enfermedad = await EnfermedadModel.findByPk(req.params.id);
        if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });

        await enfermedad.update(req.body);
        res.json({ message: "Enfermedad actualizada correctamente", enfermedad });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la enfermedad", error });
    }
};


export const deleteEnfermedad = async (req, res) => {
    try {
        const enfermedad = await EnfermedadModel.findByPk(req.params.id);
        if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });

        await enfermedad.destroy();
        res.json({ message: "Enfermedad eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la enfermedad", error });
    }
};

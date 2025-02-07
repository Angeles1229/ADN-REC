import { EnfermedadModel } from "../node/models/ADNModels.js";

async function eliminarEnfermedades() {
    try {
        console.info("🗑 Eliminando todas las enfermedades...");
        await EnfermedadModel.destroy({ where: {} });
        console.info("✅ Todas las enfermedades han sido eliminadas.");
    } catch (error) {
        console.error("❌ Error al eliminar enfermedades:", error.message);
        throw new Error("No se pudo eliminar las enfermedades.");
    }
}

eliminarEnfermedades().catch((err) => console.error(err));

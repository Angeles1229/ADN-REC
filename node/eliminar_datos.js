import { EnfermedadModel } from "../node/models/ADNModels.js"; // ✅ Verifica la ruta correcta

// Función para eliminar todos los datos de la tabla enfermedad
async function eliminarEnfermedades() {
    try {
        console.log("🗑 Eliminando todas las enfermedades...");
        await EnfermedadModel.destroy({ where: {} });
        console.log("✅ Todas las enfermedades han sido eliminadas.");
    } catch (error) {
        console.error("❌ Error al eliminar enfermedades:", error);
    }
}

// Ejecutar la función
eliminarEnfermedades();

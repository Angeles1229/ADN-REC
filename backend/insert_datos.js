async function insertarEnfermedades() {
    try {
        const enfermedades = [
            { nombre: "Cáncer de Mama", mutaciones_asociadas: "BRCA1, BRCA2" },
            { nombre: "Cáncer de Pulmón", mutaciones_asociadas: "EGFR, KRAS" },
        ];

        // Validar que los datos sean correctos antes de insertarlos
        if (!enfermedades.length) {
            throw new Error("No hay enfermedades para insertar.");
        }

        await EnfermedadModel.bulkCreate(enfermedades);
        console.info("✅ Enfermedades insertadas correctamente.");
    } catch (error) {
        console.error("❌ Error al insertar enfermedades:", error.message);
        throw new Error("No se pudieron insertar los datos.");
    }
}

insertarEnfermedades().catch((err) => console.error(err));

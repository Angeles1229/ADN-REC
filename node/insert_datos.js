import { EnfermedadModel } from "../node/models/ADNModels.js"; // Asegúrate de importar el modelo correctamente

// Función para insertar enfermedades en la base de datos
async function insertarEnfermedades() {
    try {
        await EnfermedadModel.bulkCreate([
            {
                nombre: "Cáncer de Mama",
                descripcion: "El cáncer de mama es un tipo de cáncer que se forma en las células mamarias. Puede ser causado por mutaciones genéticas heredadas.",
                mutaciones_asociadas: "BRCA1, BRCA2, CHEK2"
            },
            {
                nombre: "Cáncer de Pulmón",
                descripcion: "El cáncer de pulmón es una de las principales causas de muerte en todo el mundo. Está fuertemente relacionado con mutaciones en genes reguladores del crecimiento celular.",
                mutaciones_asociadas: "EGFR, KRAS, TP53"
            },
            {
                nombre: "Cáncer de Colon",
                descripcion: "El cáncer colorrectal se desarrolla en el intestino grueso y es causado por mutaciones en genes supresores de tumores.",
                mutaciones_asociadas: "APC, PMS2, PIK3CA"
            },
            {
                nombre: "Síndrome de Lynch",
                descripcion: "Trastorno genético que aumenta el riesgo de varios tipos de cáncer, incluidos el de colon y endometrio.",
                mutaciones_asociadas: "MLH1, MSH2, MSH6"
            },
            {
                nombre: "Fibrosis Quística",
                descripcion: "Trastorno hereditario que afecta los pulmones y el sistema digestivo debido a la acumulación de moco espeso.",
                mutaciones_asociadas: "CFTR,G542X"
            },
            {
                nombre: "Anemia de Fanconi",
                descripcion: "Trastorno genético que afecta la reparación del ADN y aumenta el riesgo de leucemia y otros cánceres.",
                mutaciones_asociadas: "FANCA, FANCC, FANCG"
            },
            {
                nombre: "Distrofia Muscular de Duchenne",
                descripcion: "Enfermedad genética que causa debilidad muscular progresiva debido a la falta de distrofina.",
                mutaciones_asociadas: "DMD"
            },
            {
                nombre: "Síndrome de Marfan",
                descripcion: "Trastorno del tejido conectivo que afecta el corazón, los ojos y los huesos.",
                mutaciones_asociadas: "FBN1"
            },
            {
                nombre: "Enfermedad de Huntington",
                descripcion: "Trastorno neurodegenerativo hereditario que causa deterioro progresivo del movimiento y la cognición.",
                mutaciones_asociadas: "HTT"
            },
            {
                nombre: "Esclerosis Lateral Amiotrófica (ELA)",
                descripcion: "Enfermedad neurodegenerativa que afecta las neuronas motoras, causando debilidad muscular progresiva.",
                mutaciones_asociadas: "SOD1, TARDBP, C9orf72"
            }
        ]);

        console.log("✅ Enfermedades insertadas correctamente en la base de datos.");
    } catch (error) {
        console.error("❌ Error al insertar enfermedades:", error);
    }
}

// Ejecutar la función
insertarEnfermedades();

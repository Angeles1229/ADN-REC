import { AnalisisADNModel, EnfermedadModel } from "../models/ADNModels.js";
import fs from "fs";
import csv from "csv-parser";

// Middleware para manejar la subida de archivos
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const analizarADN = async (req, res) => {
  try {
    const { paciente_id } = req.body;
    const archivo = req.file.path;

    // Crear el análisis en la base de datos
    const nuevoAnalisis = await AnalisisADNModel.create({
      paciente_id,
      nombre_archivo: archivo,
    });

    // 🔹 Inicializar variables
    const mutacionesDetectadas = new Set();
    const genesDetectados = new Set();
    const secuenciaADN = []; // ✅ Ahora se almacenarán correctamente los datos

    fs.createReadStream(archivo)
      .pipe(csv())
      .on("data", (row) => {
        console.log("🔹 Fila leída del CSV:", row);

        // 🔹 Extraer datos correctamente
        const gen = row.gen ? row.gen.trim() : "Desconocido";
        const mutacion = row.mutacion ? row.mutacion.trim() : "";
        const posicion = row.posicion ? Number(row.posicion) : null;

        if (gen && posicion !== null) {
          secuenciaADN.push({
            gen,
            mutacion: mutacion !== "", // ✅ Indicar si hay mutación
            posicion,
            tipo_mutacion: row.tipo_mutacion || "Desconocido",
            efecto: row.efecto || "Desconocido",
          });

          if (mutacion) {
            mutacionesDetectadas.add(mutacion);
            genesDetectados.add(gen);
          }
        }
      })
      .on("end", async () => {
        console.log("✅ Secuencia de ADN procesada:", secuenciaADN);

        // 🔹 Obtener todas las enfermedades de la base de datos
        const enfermedades = await EnfermedadModel.findAll();
        let enfermedadDetectada = null;

        let enfermedadesDetectadas = [];

      for (let enfermedad of enfermedades) {
        // Normalizamos los genes de la enfermedad
        const genesEnfermedad = enfermedad.mutaciones_asociadas
          ? enfermedad.mutaciones_asociadas.split(/,\s*/).map(m => m.trim().toUpperCase())
          : [];

        // Normalizamos los genes detectados en el archivo
        const genesArchivo = [...genesDetectados].map(gen => gen.trim().toUpperCase());

        // Buscar coincidencias
        const coincidencias = genesArchivo.filter(gen => genesEnfermedad.includes(gen));

        if (coincidencias.length > 0) {
          enfermedadesDetectadas.push(enfermedad.nombre); // 🔹 Guardar todas las coincidencias
        }
      }

      // 🔹 Si hay varias enfermedades detectadas, las mostramos todas
      const resultadoEnfermedades = enfermedadesDetectadas.length > 0
        ? enfermedadesDetectadas.join(", ")
        : "Sin coincidencias";

      // 🔹 Guardar en la BD
      await AnalisisADNModel.update(
        { enfermedad_detectada: resultadoEnfermedades },
        { where: { id: nuevoAnalisis.id } }
      );

      console.log(`✅ Enfermedades detectadas: ${resultadoEnfermedades}`);


        // 🔹 Enviar la respuesta con la secuencia procesada
        res.json({
          mensaje: "Análisis completado",
          enfermedad_detectada: enfermedadesDetectadas.length > 0 ? enfermedadesDetectadas.join(", ") : "Ninguna",
          mutaciones_detectadas: [...mutacionesDetectadas],
          secuenciaADN, 
        });
        
      });
  } catch (error) {
    console.error("❌ Error al analizar el ADN:", error);
    res.status(500).json({ error: "Error en el análisis de ADN" });
  }
};

export { analizarADN, upload };

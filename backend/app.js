import express from "express";
import db from "./database/db.js";
import cors from "cors";
import { PORT } from "./config.js";
import morgan from "morgan";

import pacientesRoutes from "./routes/pacientes.routes.js";
import laboratoristaRoutes from "./routes/laboratorista.routes.js";
import analizarRoutes from "./routes/analizar.routes.js";
import enfermedadesRoutes from "./routes/enfermedades.routes.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); 
app.use("/api", enfermedadesRoutes);
// Rutas principales
app.use("/api/analisis", analizarRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/laboratoristas", laboratoristaRoutes);

// Conexión a la base de datos
(async () => {
    try {
        await db.authenticate();
        console.info("✅ Conexión a la base de datos establecida.");
        await db.sync(); // Sin { force: true }, solo sincroniza sin borrar datos
    } catch (error) {
        console.error("❌ No se pudo conectar a la base de datos:", error.message);
    }
})();

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error("❌ Error en la aplicación:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar el servidor
app.listen(PORT, () => console.info(`🚀 Servidor corriendo en el puerto ${PORT}`));

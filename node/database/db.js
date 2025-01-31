import { Sequelize } from "sequelize";

// Configuración de la conexión con SQLite
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Archivo de la base de datos
  logging: false, // Deshabilita logs innecesarios
});

// Verificar la conexión
db.authenticate()
  .then(() => {
    console.log("Conexión establecida con SQLite.");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

export default db;

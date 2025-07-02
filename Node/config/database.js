const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log, // Active les logs SQL pour voir les requêtes
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à la base de données réussie."))
  .catch((err) => console.error("❌ Erreur de connexion:", err));

module.exports = sequelize;

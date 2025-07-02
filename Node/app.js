const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const Voiture = require("./models/Voitures");
const Acceleration = require("./models/Accelerations");
const Consommation = require("./models/Consommations");
const HistoriqueEvenement = require("./models/HistoriqueEvenements");

sequelize
  .sync({ force: false }) // `force: true` supprime et recrée les tables !
  .then(() => console.log("Database & tables created!"))
  .catch((err) => console.error("Database connection failed:", err));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const voitureRoutes = require("./routes/voitures");
const historique_evenements = require("./routes/historiqueEvenement");
app.use("/api/historique-evenements", historique_evenements);
app.use("/api/voitures", voitureRoutes);

module.exports = app;

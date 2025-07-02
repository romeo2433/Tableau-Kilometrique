const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Voitures = require("./Voitures");

const Consommations = sequelize.define("Consommation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_voiture: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Voitures, key: "id" },
    onDelete: "CASCADE", // Supprimer la consommation si la voiture associée est supprimée
  },
  consommation: {
    type: DataTypes.DECIMAL(6, 3),
    allowNull: false,
  },
});

module.exports = Consommations;

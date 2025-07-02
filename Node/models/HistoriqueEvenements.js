const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Voitures = require("./Voitures");

const HistoriqueEvenements = sequelize.define("historique_evenements", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_voiture: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Voitures, key: "id" },
    onDelete: "CASCADE",
  },
  vitesse_initiale: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  vitesse_finale: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  acceleration: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date_debut: { type: DataTypes.DATE, allowNull: false },
  date_fin: { type: DataTypes.DATE, allowNull: false },
});

module.exports = HistoriqueEvenements;

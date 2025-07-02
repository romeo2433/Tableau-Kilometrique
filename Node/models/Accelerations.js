const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Voitures = require("./Voitures");

const Accelerations = sequelize.define("accelerations", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_voiture: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Voitures, key: "id" },
    onDelete: "CASCADE",
  },
  valeur: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date_enregistrement: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Accelerations;

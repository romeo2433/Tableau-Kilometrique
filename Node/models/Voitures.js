const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Voitures = sequelize.define(
  "voitures",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    jauge_max: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    vitesse_max: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    freinage_max: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "voitures", timestamps: false }
);

module.exports = Voitures;

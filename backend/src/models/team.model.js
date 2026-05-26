import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define(
  "Team",
  {
    id_equipa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome_equipa: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    id_entidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "equipa",
    timestamps: false,
  }
);

export default Team;
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ResponsibleEntity = sequelize.define(
  "ResponsibleEntity",
  {
    id_entidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome_entidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "entidaderesponsavel",
    timestamps: false,
  }
);

export default ResponsibleEntity;
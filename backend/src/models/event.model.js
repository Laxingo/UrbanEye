import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define(
  "Event",
  {
    id_evento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    data_registo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM("ativo", "resolvido", "falso", "pendente", "encaminhado"),
      allowNull: false,
      defaultValue: "pendente",
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },

    descricao_local: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "evento",
    timestamps: false,
  }
);

export default Event;
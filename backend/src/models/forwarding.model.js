import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Forwarding = sequelize.define(
  "Forwarding",
  {
    id_encaminhamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    data_encaminhamento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    estado_encaminhamento: {
      type: DataTypes.ENUM("pendente", "em_analise", "resolvido"),
      allowNull: false,
      defaultValue: "pendente",
    },

    id_evento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    id_equipa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "encaminhamento",
    timestamps: false,
  }
);

export default Forwarding;
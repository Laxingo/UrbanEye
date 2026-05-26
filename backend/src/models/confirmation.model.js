import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Confirmation = sequelize.define(
  "Confirmation",
  {
    id_confirmacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    tipo_confirmacao: {
      type: DataTypes.ENUM("confirmacao", "rejeicao"),
      allowNull: false,
    },

    data_confirmacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    id_evento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "confirmacao",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["id_evento", "id_utilizador"],
      },
    ],
  }
);

export default Confirmation;
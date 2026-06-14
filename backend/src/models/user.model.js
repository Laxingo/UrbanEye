import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Representa os utilizadores e respetivos níveis de acesso.
const User = sequelize.define(
  "User",
  {
    id_utilizador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

tipo_utilizador: {
  type: DataTypes.ENUM("cidadao", "moderador", "gestor_municipal", "tecnico"),
  allowNull: false,
  defaultValue: "cidadao",
},

    fotografia: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "utilizador",
    timestamps: false,
  }
);

export default User;





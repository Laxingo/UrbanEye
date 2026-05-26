import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nome_categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    descricao_categoria: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "categoria",
    timestamps: false,
  }
);

export default Category;
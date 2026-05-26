import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CategoryTeam = sequelize.define(
  "CategoryTeam",
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    id_equipa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: "categoriaequipa",
    timestamps: false,
  }
);

export default CategoryTeam;
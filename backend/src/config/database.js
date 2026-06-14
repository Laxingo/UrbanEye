import "dotenv/config";
import { Sequelize } from "sequelize";

// Cria a ligação à base de dados com os valores definidos no .env.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

export default sequelize;

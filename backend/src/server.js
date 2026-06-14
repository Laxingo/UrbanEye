import "dotenv/config";
import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT || 3000;

try {
  // Confirma a ligação à base de dados antes de abrir a API.
  await db.sequelize.authenticate();
  console.log("Database connection established successfully.");

// Para desenvolvimento, pode ser usado para sincronizar os modelos.
// await db.sequelize.sync();
// console.log("Database synchronized successfully.");

  // Só começa a aceitar pedidos depois da ligação estar pronta.
  app.listen(PORT, () => {
    console.log(`UrbanEye API running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Unable to start server:", error.message);
}

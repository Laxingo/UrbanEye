import "dotenv/config";
import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT || 3000;

try {
  await db.sequelize.authenticate();
  console.log("Database connection established successfully.");

  app.listen(PORT, () => {
    console.log(`UrbanEye API running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Unable to start server:", error.message);
}
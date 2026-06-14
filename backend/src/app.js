import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import forwardingsRoutes from "./routes/forwardings.routes.js";
import confirmationsRoutes from "./routes/confirmations.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Permite pedidos do frontend e o envio de credenciais.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Rota simples para confirmar que a API está online.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UrbanEye API is running",
  });
});

// Liga cada grupo de endpoints às respetivas rotas.
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api", forwardingsRoutes);
app.use("/api", confirmationsRoutes);
app.use("/api/teams", teamsRoutes);

// Trata os erros que chegam das rotas num único sítio.
app.use(errorHandler)

export default app;

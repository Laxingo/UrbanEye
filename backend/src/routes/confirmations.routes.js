import express from "express";

import { createConfirmation } from "../controllers/confirmations.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Regista a confirmação ou rejeição de um evento autenticado.
router.post(
  "/events/:id/confirmations",
  authenticate,
  authorizeRoles("cidadao", "moderador", "gestor_municipal"),
  createConfirmation
);

export default router;

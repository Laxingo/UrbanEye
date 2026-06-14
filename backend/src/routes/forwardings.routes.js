import express from "express";

import {
  getForwardings,
  createForwarding,
  updateForwarding,
  deleteForwarding,
} from "../controllers/forwardings.controller.js"

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Equipa municipal e técnicos podem consultar encaminhamentos.
router.get(
  "/forwardings",
  authenticate,
  authorizeRoles("moderador", "gestor_municipal", "tecnico"),
  getForwardings
)

// Moderadores e gestores podem encaminhar eventos.
router.post(
  "/events/:id/forwardings",
  authenticate,
  authorizeRoles("moderador", "gestor_municipal"),
  createForwarding
);

// Gestores e técnicos acompanham o estado do trabalho.
router.patch(
  "/forwardings/:id",
  authenticate,
  authorizeRoles("gestor_municipal", "tecnico"),
  updateForwarding
);

// Apenas gestores podem remover encaminhamentos.
router.delete(
  "/forwardings/:id",
  authenticate,
  authorizeRoles("gestor_municipal"),
  deleteForwarding
);

export default router;

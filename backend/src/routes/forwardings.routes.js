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

router.get(
  "/forwardings",
  authenticate,
  authorizeRoles("moderador", "gestor_municipal", "tecnico"),
  getForwardings
)

router.post(
  "/events/:id/forwardings",
  authenticate,
  authorizeRoles("moderador", "gestor_municipal"),
  createForwarding
);

router.patch(
  "/forwardings/:id",
  authenticate,
  authorizeRoles("gestor_municipal", "tecnico"),
  updateForwarding
);

router.delete(
  "/forwardings/:id",
  authenticate,
  authorizeRoles("gestor_municipal"),
  deleteForwarding
);

export default router;
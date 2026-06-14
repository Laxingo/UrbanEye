import express from "express";

import {
  getTeams,
  createTeam,
  deleteTeam,
} from "../controllers/teams.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// A equipa municipal pode consultar as equipas disponíveis.
router.get(
  "/",
  authenticate,
  authorizeRoles("moderador", "gestor_municipal", "tecnico"),
  getTeams
);

// Só gestores municipais podem criar ou remover equipas.
router.post(
  "/",
  authenticate,
  authorizeRoles("gestor_municipal"),
  createTeam
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("gestor_municipal"),
  deleteTeam
);

export default router;

import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller.js";

import {
  authenticate,
  authorizeRoles,
  authorizeEventOwnerOrStaff,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Pode ficar público para alimentar o mapa/dashboard
router.get("/", getEvents);
router.get("/:id", getEventById);

// Criar evento: cidadãos, moderadores e gestores municipais
router.post(
  "/",
  authenticate,
  authorizeRoles("cidadao", "moderador", "gestor_municipal"),
  createEvent
);

// Editar evento: dono do evento, moderador ou gestor municipal
router.patch(
  "/:id",
  authenticate,
  authorizeEventOwnerOrStaff,
  updateEvent
);

// Apagar evento: dono do evento, moderador ou gestor municipal
router.delete(
  "/:id",
  authenticate,
  authorizeEventOwnerOrStaff,
  deleteEvent
);

export default router;
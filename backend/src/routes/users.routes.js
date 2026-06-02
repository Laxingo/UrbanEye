import express from "express";

import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

import {
  authenticate,
  authorizeOwnerOrAdmin,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Rotas públicas
router.post("/", createUser);
router.post("/login", loginUser);

// Só gestor municipal pode listar todos os utilizadores
router.get(
  "/",
  authenticate,
  authorizeRoles("gestor_municipal"),
  getUsers
);

// Dono da conta ou gestor municipal
router.get(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin,
  getUserById
);

// Dono da conta ou gestor municipal
router.patch(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin,
  updateUser
);

// Dono da conta ou gestor municipal
router.delete(
  "/:id",
  authenticate,
  authorizeOwnerOrAdmin,
  deleteUser
);

export default router;
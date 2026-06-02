import express from "express";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

import {
  authenticate,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Público: qualquer utilizador pode ver categorias
router.get("/", getCategories);

// Protegido: só gestor municipal pode gerir categorias
router.post(
  "/",
  authenticate,
  authorizeRoles("gestor_municipal"),
  createCategory
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("gestor_municipal"),
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("gestor_municipal"),
  deleteCategory
);

export default router;
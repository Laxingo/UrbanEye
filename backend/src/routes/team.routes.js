// routes/teams.routes.js
import express from "express";
import {
  getTeams,
  createTeam,
  deleteTeam,
  getTeamCategories,
  addCategoryToTeam,
  removeCategoryFromTeam,
} from "../controllers/teams.controller.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", createTeam);
router.delete("/:id", deleteTeam);

// categorias da equipa
router.get("/:id/categories", getTeamCategories);
router.post("/:id/categories", addCategoryToTeam);
router.delete("/:id/categories/:categoryId", removeCategoryFromTeam);

export default router;

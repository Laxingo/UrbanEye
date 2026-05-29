// controllers/teams.controller.js
import Team from "../models/team.model.js";
import Category from "../models/category.model.js";
import CategoryTeam from "../models/categoryTeam.model.js";
import Forwarding from "../models/forwarding.model.js";

/**
 * GET /teams
 */
export async function getTeams(req, res) {
  try {
    const teams = await Team.findAll({
      order: [["nome_equipa", "ASC"]],
    });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("getTeams error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * POST /teams
 */
export async function createTeam(req, res) {
  try {
    const { nome_equipa, id_entidade } = req.body;

    if (!nome_equipa || !id_entidade) {
      return res.status(400).json({ error: "invalid data" });
    }

    const team = await Team.create({
      nome_equipa,
      id_entidade,
    });

    return res.status(201).json(team);
  } catch (error) {
    console.error("createTeam error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * DELETE /teams/:id
 */
export async function deleteTeam(req, res) {
  try {
    const { id } = req.params;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const hasCategoryLinks = await CategoryTeam.findOne({
      where: { id_equipa: id },
    });

    const hasForwardings = await Forwarding.findOne({
      where: { id_equipa: id },
    });

    if (hasCategoryLinks || hasForwardings) {
      return res.status(409).json({ error: "Team has dependencies" });
    }

    await team.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("deleteTeam error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * GET /teams/:id/categories
 */
export async function getTeamCategories(req, res) {
  try {
    const { id } = req.params;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const categories = await Category.findAll({
      include: [
        {
          model: CategoryTeam,
          where: { id_equipa: id },
          attributes: [],
        },
      ],
      order: [["nome_categoria", "ASC"]],
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("getTeamCategories error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * POST /teams/:id/categories
 * Body: { id_categoria }
 */
export async function addCategoryToTeam(req, res) {
  try {
    const { id } = req.params;
    const { id_categoria } = req.body;

    if (!id_categoria) {
      return res.status(400).json({ error: "invalid data" });
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const category = await Category.findByPk(id_categoria);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const exists = await CategoryTeam.findOne({
      where: { id_equipa: id, id_categoria },
    });

    if (exists) {
      return res.status(409).json({ error: "Relation already exists" });
    }

    const relation = await CategoryTeam.create({
      id_equipa: id,
      id_categoria,
    });

    return res.status(201).json(relation);
  } catch (error) {
    console.error("addCategoryToTeam error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

/**
 * DELETE /teams/:id/categories/:categoryId
 */
export async function removeCategoryFromTeam(req, res) {
  try {
    const { id, categoryId } = req.params;

    const relation = await CategoryTeam.findOne({
      where: { id_equipa: id, id_categoria: categoryId },
    });

    if (!relation) {
      return res.status(404).json({ error: "Relation not found" });
    }

    await relation.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("removeCategoryFromTeam error:", error);
    return res.status(500).json({ error: "internal error" });
  }
}

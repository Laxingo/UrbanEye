// controllers/categories.controller.js
import { Sequelize } from "sequelize";
import Category from "../models/category.model.js";
import Event from "../models/event.model.js";
import CategoryTeam from "../models/categoryTeam.model.js";

/**
 * GET /categories
 * Returns all categories ordered by name
 */
export async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      order: [["nome_categoria", "ASC"]],
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /categories
 * Body: { nome_categoria, descricao_categoria? }
 */
export async function createCategory(req, res) {
  try {
    const { nome_categoria, descricao_categoria = null } = req.body;

    if (!nome_categoria || !nome_categoria.trim()) {
      return res.status(400).json({ error: "Missing required field: nome_categoria" });
    }

    const name = nome_categoria.trim();

    const existing = await Category.findOne({ where: { nome_categoria: name } });
    if (existing) {
      return res.status(409).json({ error: "Categoria já existe" });
    }

    const newCategory = await Category.create({
      nome_categoria: name,
      descricao_categoria,
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("createCategory error:", error);
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ error: "Categoria já existe" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PATCH /categories/:id
 * Body: { nome_categoria?, descricao_categoria? }
 */
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { nome_categoria, descricao_categoria } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    if (nome_categoria && nome_categoria.trim()) {
      const name = nome_categoria.trim();
      const conflict = await Category.findOne({
        where: {
          nome_categoria: name,
          id_categoria: { [Sequelize.Op.ne]: category.id_categoria },
        },
      });
      if (conflict) {
        return res.status(409).json({ error: "Categoria já existe" });
      }
      category.nome_categoria = name;
    }

    if (descricao_categoria !== undefined) {
      category.descricao_categoria = descricao_categoria;
    }

    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    console.error("updateCategory error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * DELETE /categories/:id
 * Prevent deletion if category is referenced by events or category-team relations
 */
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    const relatedEvent = await Event.findOne({ where: { id_categoria: category.id_categoria } });
    if (relatedEvent) {
      return res.status(409).json({ error: "Categoria não pode ser eliminada" });
    }

    const relatedCatTeam = await CategoryTeam.findOne({
      where: { id_categoria: category.id_categoria },
    });
    if (relatedCatTeam) {
      return res.status(409).json({ error: "Categoria não pode ser eliminada" });
    }

    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

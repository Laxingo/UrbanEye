// Gere a criação, edição, listagem e remoção de categorias.
import { Sequelize } from "sequelize";
import Category from "../models/category.model.js";
import Event from "../models/event.model.js";
import CategoryTeam from "../models/categoryTeam.model.js";
import {
  validationError,
  conflictError,
  notFoundError,
} from "../utils/error.utils.js";

// Lista todas as categorias por ordem alfabética.
export async function getCategories(req, res, next) {
  try {
    const categories = await Category.findAll({
      order: [["nome_categoria", "ASC"]],
    });

    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

// Cria uma categoria, evitando nomes repetidos.
export async function createCategory(req, res, next) {
  try {
    const { nome_categoria, descricao_categoria = null } = req.body;

    if (!nome_categoria || !nome_categoria.trim()) {
      throw validationError("Missing required field: nome_categoria");
    }

    const name = nome_categoria.trim();

    const existing = await Category.findOne({
      where: { nome_categoria: name },
    });

    if (existing) {
      throw conflictError("Categoria já existe");
    }

    const newCategory = await Category.create({
      nome_categoria: name,
      descricao_categoria,
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return next(conflictError("Categoria já existe"));
    }

    next(error);
  }
}

// Atualiza apenas os campos recebidos para a categoria.
export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { nome_categoria, descricao_categoria } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      throw notFoundError("Categoria");
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
        throw conflictError("Categoria já existe");
      }

      category.nome_categoria = name;
    }

    if (descricao_categoria !== undefined) {
      category.descricao_categoria = descricao_categoria;
    }

    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
}

// Só elimina categorias que não estejam a ser usadas.
export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      throw notFoundError("Categoria");
    }

    const relatedEvent = await Event.findOne({
      where: { id_categoria: category.id_categoria },
    });

    if (relatedEvent) {
      throw conflictError("Categoria não pode ser eliminada");
    }

    const relatedCatTeam = await CategoryTeam.findOne({
      where: { id_categoria: category.id_categoria },
    });

    if (relatedCatTeam) {
      throw conflictError("Categoria não pode ser eliminada");
    }

    await category.destroy();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

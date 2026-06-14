import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import {
  validationError,
  notFoundError,
} from "../utils/error.utils.js";

// Lista eventos com os dados necessários do autor e da categoria.
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          attributes: ["id_utilizador", "nome", "email", "tipo_utilizador"],
        },
        {
          model: Category,
          attributes: ["id_categoria", "nome_categoria", "descricao_categoria"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Devolve os detalhes completos de um evento.
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id_utilizador", "nome", "email", "tipo_utilizador"],
        },
        {
          model: Category,
          attributes: ["id_categoria", "nome_categoria", "descricao_categoria"],
        },
      ],
    });

    if (!event) {
      throw notFoundError("Event");
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Cria um evento associado ao utilizador autenticado.
export const createEvent = async (req, res, next) => {
  try {
    const {
      descricao,
      latitude,
      longitude,
      descricao_local,
      id_categoria,
    } = req.body;

    const id_utilizador = req.user.id_utilizador;

    if (!descricao || latitude === undefined || longitude === undefined || !id_categoria) {
      throw validationError("Description, latitude, longitude and category are required.");
    }

    const user = await User.findByPk(id_utilizador);

    if (!user) {
      throw notFoundError("User");
    }

    const category = await Category.findByPk(id_categoria);

    if (!category) {
      throw notFoundError("Category");
    }

    const event = await Event.create({
      descricao,
      latitude,
      longitude,
      descricao_local: descricao_local || null,
      id_utilizador,
      id_categoria,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Atualiza apenas os dados enviados e valida uma nova categoria.
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      throw notFoundError("Event");
    }

    const {
      descricao,
      estado,
      latitude,
      longitude,
      descricao_local,
      id_categoria,
    } = req.body;

    if (id_categoria !== undefined) {
      const category = await Category.findByPk(id_categoria);

      if (!category) {
        throw notFoundError("Category");
      }

      event.id_categoria = id_categoria;
    }

    if (descricao !== undefined) event.descricao = descricao;
    if (estado !== undefined) event.estado = estado;
    if (latitude !== undefined) event.latitude = latitude;
    if (longitude !== undefined) event.longitude = longitude;
    if (descricao_local !== undefined) event.descricao_local = descricao_local;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Apaga um evento existente.
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      throw notFoundError("Event");
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

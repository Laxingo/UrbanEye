import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

export const getEvents = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: "Error fetching events.",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching event.",
      error: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      descricao,
      latitude,
      longitude,
      descricao_local,
      id_utilizador,
      id_categoria,
    } = req.body;

    if (!descricao || !latitude || !longitude || !id_utilizador || !id_categoria) {
      return res.status(400).json({
        success: false,
        message: "Description, latitude, longitude, user and category are required.",
      });
    }

    const user = await User.findByPk(id_utilizador);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const category = await Category.findByPk(id_categoria);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
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
    return res.status(500).json({
      success: false,
      message: "Error creating event.",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const {
      descricao,
      estado,
      latitude,
      longitude,
      descricao_local,
      id_categoria,
    } = req.body;

    if (descricao !== undefined) event.descricao = descricao;
    if (estado !== undefined) event.estado = estado;
    if (latitude !== undefined) event.latitude = latitude;
    if (longitude !== undefined) event.longitude = longitude;
    if (descricao_local !== undefined) event.descricao_local = descricao_local;
    if (id_categoria !== undefined) event.id_categoria = id_categoria;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating event.",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    await event.destroy();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting event.",
      error: error.message,
    });
  }
};
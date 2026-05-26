// controllers/events.controller.js
import { Op } from "sequelize";
import Event from "../models/event.model.js";

/**
 * GET /events
 * Supports: page, limit, estado, id_categoria, id_utilizador, bbox (minLat,minLng,maxLat,maxLng)
 */
export async function getEvents(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      estado,
      id_categoria,
      id_utilizador,
      bbox,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.max(parseInt(limit, 10) || 20, 1);
    const offset = (pageNum - 1) * pageLimit;

    const where = {};
    if (estado) where.estado = estado;
    if (id_categoria) where.id_categoria = id_categoria;
    if (id_utilizador) where.id_utilizador = id_utilizador;

    if (bbox) {
      const parts = bbox.split(",").map((p) => parseFloat(p));
      if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
        const [minLat, minLng, maxLat, maxLng] = parts;
        where.latitude = { [Op.between]: [minLat, maxLat] };
        where.longitude = { [Op.between]: [minLng, maxLng] };
      }
    }

    const { rows: data, count: total } = await Event.findAndCountAll({
      where,
      limit: pageLimit,
      offset,
      order: [["data_registo", "DESC"]],
    });

    return res.json({
      meta: { total, page: pageNum, limit: pageLimit },
      data,
    });
  } catch (error) {
    console.error("getEvents error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /events/:id
 */
export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) return res.status(404).json({ error: "Event not found" });

    return res.json(event);
  } catch (error) {
    console.error("getEventById error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /events
 * Body: { descricao, id_categoria, latitude, longitude, descricao_local?, id_utilizador }
 */
export async function createEvent(req, res) {
  try {
    const {
      descricao,
      id_categoria,
      latitude,
      longitude,
      descricao_local = null,
      id_utilizador,
    } = req.body;

    if (
      !descricao ||
      id_categoria == null ||
      latitude == null ||
      longitude == null ||
      id_utilizador == null
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: descricao, id_categoria, latitude, longitude, id_utilizador",
      });
    }

    const newEvent = await Event.create({
      descricao,
      id_categoria,
      latitude,
      longitude,
      descricao_local,
      id_utilizador,
    });

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error("createEvent error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PATCH /events/:id
 * Allowed updates: descricao, estado, id_categoria, descricao_local
 */
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { descricao, estado, id_categoria, descricao_local } = req.body;

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const updates = {};
    if (descricao !== undefined) updates.descricao = descricao;
    if (estado !== undefined) updates.estado = estado;
    if (id_categoria !== undefined) updates.id_categoria = id_categoria;
    if (descricao_local !== undefined) updates.descricao_local = descricao_local;

    await event.update(updates);

    return res.json(event);
  } catch (error) {
    console.error("updateEvent error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * DELETE /events/:id
 */
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await event.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("deleteEvent error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

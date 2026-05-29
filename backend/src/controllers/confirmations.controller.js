// controllers/confirmations.controller.js
import Confirmation from "../models/Confirmation.js";
import Event from "../models/Event.js";

/**
 * POST /events/:id/confirmations
 * Body: { tipo_confirmacao }
 */
export async function createConfirmation(req, res) {
  try {
    const { id } = req.params; // event ID
    const { tipo_confirmacao } = req.body;
    const id_utilizador = req.user?.id || req.body.id_utilizador; 
    // Caso ainda não tenhas auth middleware, usa o body temporariamente

    if (!tipo_confirmacao) {
      return res.status(400).json({ error: "Missing field: tipo_confirmacao" });
    }

    if (!["confirmacao", "rejeicao"].includes(tipo_confirmacao)) {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (!id_utilizador) {
      return res.status(400).json({ error: "Missing field: id_utilizador" });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existing = await Confirmation.findOne({
      where: { id_evento: id, id_utilizador }
    });

    if (existing) {
      return res.status(409).json({ error: "Already interacted" });
    }

    const confirmation = await Confirmation.create({
      tipo_confirmacao,
      id_evento: id,
      id_utilizador
    });

    return res.status(201).json(confirmation);
  } catch (error) {
    console.error("createConfirmation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// controllers/forwardings.controller.js
import Forwarding from "../models/forwarding.model.js";
import Event from "../models/event.model.js";
import Team from "../models/team.model.js";

/**
 * POST /events/:id/forwardings
 * Body: { teamId, status?, notes? }
 */
export async function createForwarding(req, res) {
  try {
    const { id } = req.params; // event ID
    const { teamId, status = "pendente" } = req.body;

    if (!teamId) {
      return res.status(400).json({ error: "Missing required field: teamId" });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const forwarding = await Forwarding.create({
  id_evento: event.id_evento,
  id_equipa: team.id_equipa,
  estado_encaminhamento: status,
});

    return res.status(201).json(forwarding);
  } catch (error) {
    console.error("createForwarding error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PATCH /forwardings/:id
 * Body: { status?, notes? }
 */
export async function updateForwarding(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const forwarding = await Forwarding.findByPk(id);
    if (!forwarding) {
      return res.status(404).json({ error: "Forwarding not found" });
    }

    if (status !== undefined) forwarding.estado_encaminhamento = status;

    await forwarding.save();

    return res.status(200).json(forwarding);
  } catch (error) {
    console.error("updateForwarding error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * DELETE /forwardings/:id
 */
export async function deleteForwarding(req, res) {
  try {
    const { id } = req.params;

    const forwarding = await Forwarding.findByPk(id);
    if (!forwarding) {
      return res.status(404).json({ error: "Forwarding not found" });
    }

    await forwarding.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("deleteForwarding error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

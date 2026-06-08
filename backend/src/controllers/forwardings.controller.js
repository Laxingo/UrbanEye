import Event from "../models/event.model.js"
import Team from "../models/team.model.js"
import Forwarding from "../models/forwarding.model.js"

export const createForwarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, status = "pendente" } = req.body;

    const id_evento = Number(id);

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required.",
      });
    }

    if (!["pendente", "em_analise", "resolvido"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid forwarding status.",
      });
    }

    const event = await Event.findByPk(id_evento);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const team = await Team.findByPk(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    const forwarding = await Forwarding.create({
      id_evento,
      id_equipa: teamId,
      estado_encaminhamento: status,
    });

    event.estado = "encaminhado";
    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event forwarded successfully.",
      forwarding,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating forwarding.",
      error: error.message,
    });
  }
};

export const updateForwarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Forwarding status is required.",
      });
    }

    if (!["pendente", "em_analise", "resolvido"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid forwarding status.",
      });
    }

    const forwarding = await Forwarding.findByPk(id);

    if (!forwarding) {
      return res.status(404).json({
        success: false,
        message: "Forwarding not found.",
      });
    }

    forwarding.estado_encaminhamento = status;
    await forwarding.save();

    if (status === "resolvido") {
      const event = await Event.findByPk(forwarding.id_evento);

      if (event) {
        event.estado = "resolvido";
        await event.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Forwarding updated successfully.",
      forwarding,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating forwarding.",
      error: error.message,
    });
  }
};

export const deleteForwarding = async (req, res) => {
  try {
    const { id } = req.params;

    const forwarding = await Forwarding.findByPk(id);

    if (!forwarding) {
      return res.status(404).json({
        success: false,
        message: "Forwarding not found.",
      });
    }

    await forwarding.destroy();

    return res.status(200).json({
      success: true,
      message: "Forwarding deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting forwarding.",
      error: error.message,
    });
  }
};

export const getForwardings = async (req, res) => {
  try {
    const forwardings = await Forwarding.findAll({
      include: [
        {
          model: Event,
          attributes: [
            "id_evento",
            "descricao",
            "estado",
            "latitude",
            "longitude",
            "descricao_local",
            "id_categoria",
            "id_utilizador"
          ]
        },
        {
          model: Team,
          attributes: [
            "id_equipa",
            "nome_equipa",
            "id_entidade"
          ]
        }
      ],
      order: [["id_encaminhamento", "DESC"]]
    })

    return res.status(200).json({
      success: true,
      forwardings
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching forwardings.",
      error: error.message
    })
  }
}
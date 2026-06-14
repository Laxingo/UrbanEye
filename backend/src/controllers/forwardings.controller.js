import Event from "../models/event.model.js";
import Team from "../models/team.model.js";
import Forwarding from "../models/forwarding.model.js";
import {
  validationError,
  notFoundError,
} from "../utils/error.utils.js";

// Encaminha um evento para uma equipa e atualiza o estado do evento.
export const createForwarding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamId, status = "pendente" } = req.body;

    const id_evento = Number(id);

    if (!teamId) {
      throw validationError("Team ID is required.");
    }

    if (!["pendente", "em_analise", "resolvido"].includes(status)) {
      throw validationError("Invalid forwarding status.");
    }

    const event = await Event.findByPk(id_evento);

    if (!event) {
      throw notFoundError("Event");
    }

    const team = await Team.findByPk(teamId);

    if (!team) {
      throw notFoundError("Team");
    }

    const forwarding = await Forwarding.create({
      id_evento,
      id_equipa: teamId,
      estado_encaminhamento: status,
    });

    // Mantém o estado do evento alinhado com o novo encaminhamento.
    event.estado = "encaminhado";
    await event.save();

    return res.status(201).json({
      success: true,
      message: "Event forwarded successfully.",
      forwarding,
    });
  } catch (error) {
    next(error);
  }
};

// Altera o estado de um encaminhamento já criado.
export const updateForwarding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw validationError("Forwarding status is required.");
    }

    if (!["pendente", "em_analise", "resolvido"].includes(status)) {
      throw validationError("Invalid forwarding status.");
    }

    const forwarding = await Forwarding.findByPk(id);

    if (!forwarding) {
      throw notFoundError("Forwarding");
    }

    forwarding.estado_encaminhamento = status;
    await forwarding.save();

    // Ao resolver o encaminhamento, o evento também fica resolvido.
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
    next(error);
  }
};

// Remove um encaminhamento específico.
export const deleteForwarding = async (req, res, next) => {
  try {
    const { id } = req.params;

    const forwarding = await Forwarding.findByPk(id);

    if (!forwarding) {
      throw notFoundError("Forwarding");
    }

    await forwarding.destroy();

    return res.status(200).json({
      success: true,
      message: "Forwarding deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Lista os encaminhamentos com os respetivos eventos e equipas.
export const getForwardings = async (req, res, next) => {
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
            "id_utilizador",
          ],
        },
        {
          model: Team,
          attributes: [
            "id_equipa",
            "nome_equipa",
            "id_entidade",
          ],
        },
      ],
      order: [["id_encaminhamento", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      forwardings,
    });
  } catch (error) {
    next(error);
  }
};

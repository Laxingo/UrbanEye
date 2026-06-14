import Event from "../models/event.model.js";
import Confirmation from "../models/confirmation.model.js";
import {
  validationError,
  notFoundError,
  conflictError,
} from "../utils/error.utils.js";

// Regista a confirmação ou rejeição de um evento por um utilizador.
export const createConfirmation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo_confirmacao } = req.body;

    const id_evento = Number(id);
    const id_utilizador = req.user.id_utilizador;

    if (!tipo_confirmacao) {
      throw validationError("Confirmation type is required.");
    }

    if (!["confirmacao", "rejeicao"].includes(tipo_confirmacao)) {
      throw validationError("Confirmation type must be 'confirmacao' or 'rejeicao'.");
    }

    const event = await Event.findByPk(id_evento);

    if (!event) {
      throw notFoundError("Event");
    }

    // Cada utilizador só pode votar uma vez no mesmo evento.
    const existingConfirmation = await Confirmation.findOne({
      where: {
        id_evento,
        id_utilizador,
      },
    });

    if (existingConfirmation) {
      throw conflictError("You have already confirmed or rejected this event.");
    }

    const confirmation = await Confirmation.create({
      tipo_confirmacao,
      id_evento,
      id_utilizador,
    });

    return res.status(201).json({
      success: true,
      message: "Confirmation registered successfully.",
      confirmation,
    });
  } catch (error) {
    next(error);
  }
};

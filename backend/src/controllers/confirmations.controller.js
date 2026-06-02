import Event from "../models/event.model.js";
import Confirmation from "../models/confirmation.model.js";

export const createConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo_confirmacao } = req.body;

    const id_evento = Number(id);
    const id_utilizador = req.user.id_utilizador;

    if (!tipo_confirmacao) {
      return res.status(400).json({
        success: false,
        message: "Confirmation type is required.",
      });
    }

    if (!["confirmacao", "rejeicao"].includes(tipo_confirmacao)) {
      return res.status(400).json({
        success: false,
        message: "Confirmation type must be 'confirmacao' or 'rejeicao'.",
      });
    }

    const event = await Event.findByPk(id_evento);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const existingConfirmation = await Confirmation.findOne({
      where: {
        id_evento,
        id_utilizador,
      },
    });

    if (existingConfirmation) {
      return res.status(409).json({
        success: false,
        message: "You have already confirmed or rejected this event.",
      });
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
    return res.status(500).json({
      success: false,
      message: "Error creating confirmation.",
      error: error.message,
    });
  }
};
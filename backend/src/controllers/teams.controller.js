import Team from "../models/team.model.js";
import ResponsibleEntity from "../models/responsibleEntity.model.js";

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: ResponsibleEntity,
          attributes: ["id_entidade", "nome_entidade", "email", "telefone"],
        },
      ],
      order: [["id_equipa", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teams.",
      error: error.message,
    });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { nome_equipa, id_entidade } = req.body;

    if (!nome_equipa || !id_entidade) {
      return res.status(400).json({
        success: false,
        message: "Team name and responsible entity are required.",
      });
    }

    const responsibleEntity = await ResponsibleEntity.findByPk(id_entidade);

    if (!responsibleEntity) {
      return res.status(404).json({
        success: false,
        message: "Responsible entity not found.",
      });
    }

    const team = await Team.create({
      nome_equipa,
      id_entidade,
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully.",
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating team.",
      error: error.message,
    });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByPk(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    await team.destroy();

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting team.",
      error: error.message,
    });
  }
};
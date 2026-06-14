import Team from "../models/team.model.js";
import ResponsibleEntity from "../models/responsibleEntity.model.js";
import {
  validationError,
  notFoundError,
} from "../utils/error.utils.js";

export const getTeams = async (req, res, next) => {
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
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { nome_equipa, id_entidade } = req.body;

    if (!nome_equipa || !id_entidade) {
      throw validationError("Team name and responsible entity are required.");
    }

    const responsibleEntity = await ResponsibleEntity.findByPk(id_entidade);

    if (!responsibleEntity) {
      throw notFoundError("Responsible entity");
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
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findByPk(id);

    if (!team) {
      throw notFoundError("Team");
    }

    await team.destroy();

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
import sequelize from "../config/database.js";

import User from "./user.model.js";
import Category from "./category.model.js";
import ResponsibleEntity from "./responsibleEntity.model.js";
import Team from "./team.model.js";
import Event from "./event.model.js";
import CategoryTeam from "./categoryTeam.model.js";
import Confirmation from "./confirmation.model.js";
import Forwarding from "./forwarding.model.js";

// Utilizador -> Evento
User.hasMany(Event, {
  foreignKey: "id_utilizador",
});

Event.belongsTo(User, {
  foreignKey: "id_utilizador",
});

// Categoria -> Evento
Category.hasMany(Event, {
  foreignKey: "id_categoria",
});

Event.belongsTo(Category, {
  foreignKey: "id_categoria",
});

// EntidadeResponsavel -> Equipa
ResponsibleEntity.hasMany(Team, {
  foreignKey: "id_entidade",
});

Team.belongsTo(ResponsibleEntity, {
  foreignKey: "id_entidade",
});

// Categoria <-> Equipa
Category.belongsToMany(Team, {
  through: CategoryTeam,
  foreignKey: "id_categoria",
  otherKey: "id_equipa",
});

Team.belongsToMany(Category, {
  through: CategoryTeam,
  foreignKey: "id_equipa",
  otherKey: "id_categoria",
});

// Evento -> Confirmacao
Event.hasMany(Confirmation, {
  foreignKey: "id_evento",
});

Confirmation.belongsTo(Event, {
  foreignKey: "id_evento",
});

// Utilizador -> Confirmacao
User.hasMany(Confirmation, {
  foreignKey: "id_utilizador",
});

Confirmation.belongsTo(User, {
  foreignKey: "id_utilizador",
});

// Evento -> Encaminhamento
Event.hasMany(Forwarding, {
  foreignKey: "id_evento",
});

Forwarding.belongsTo(Event, {
  foreignKey: "id_evento",
});

// Equipa -> Encaminhamento
Team.hasMany(Forwarding, {
  foreignKey: "id_equipa",
});

Forwarding.belongsTo(Team, {
  foreignKey: "id_equipa",
});

const db = {
  sequelize,
  User,
  Category,
  ResponsibleEntity,
  Team,
  Event,
  CategoryTeam,
  Confirmation,
  Forwarding,
};

export default db;
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Event from "../models/event.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "urbaneye_secret"
    );

    const user = await User.findByPk(decoded.id, {
      attributes: [
        "id_utilizador",
        "nome",
        "email",
        "tipo_utilizador",
        "fotografia",
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.tipo_utilizador)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

export const authorizeOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = Number(req.params.id);
  const authenticatedUserId = Number(req.user.id_utilizador);

  const isOwner = requestedUserId === authenticatedUserId;

  // Neste projeto, gestor_municipal funciona como admin
  const isAdmin = req.user.tipo_utilizador === "gestor_municipal";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You can only access your own account.",
    });
  }

  next();
};

export const authorizeEventOwnerOrStaff = async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const isOwner =
      Number(event.id_utilizador) === Number(req.user.id_utilizador);

    const isStaff = ["moderador", "gestor_municipal"].includes(
      req.user.tipo_utilizador
    );

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this event.",
      });
    }

    req.event = event;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking event permissions.",
      error: error.message,
    });
  }
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { nome, email, password, tipo_utilizador, fotografia } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nome,
      email,
      password: hashedPassword,
      tipo_utilizador: tipo_utilizador || "cidadao",
      fotografia: fotografia || null,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id_utilizador: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo_utilizador: user.tipo_utilizador,
        fotografia: user.fotografia,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating user.",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id_utilizador,
        email: user.email,
        tipo_utilizador: user.tipo_utilizador,
      },
      process.env.JWT_SECRET || "urbaneye_secret",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id_utilizador: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo_utilizador: user.tipo_utilizador,
        fotografia: user.fotografia,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging in.",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id_utilizador",
        "nome",
        "email",
        "tipo_utilizador",
        "fotografia",
      ],
      order: [["id_utilizador", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users.",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        "id_utilizador",
        "nome",
        "email",
        "tipo_utilizador",
        "fotografia",
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user.",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password, tipo_utilizador, fotografia } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use.",
        });
      }
    }

    if (nome !== undefined) user.nome = nome;
    if (email !== undefined) user.email = email;
    if (tipo_utilizador !== undefined) user.tipo_utilizador = tipo_utilizador;
    if (fotografia !== undefined) user.fotografia = fotografia;

    if (password !== undefined && password !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: {
        id_utilizador: user.id_utilizador,
        nome: user.nome,
        email: user.email,
        tipo_utilizador: user.tipo_utilizador,
        fotografia: user.fotografia,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user.",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user.",
      error: error.message,
    });
  }
};
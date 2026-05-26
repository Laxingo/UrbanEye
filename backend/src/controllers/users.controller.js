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
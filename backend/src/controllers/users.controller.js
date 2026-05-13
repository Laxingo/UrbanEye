import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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

    const isPasswordValid =
      (await bcrypt.compare(password, user.password)) || password === user.password;

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
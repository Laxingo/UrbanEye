import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  return jwt.sign(
    {
      id_utilizador: user.id_utilizador,
      email: user.email,
      role: user.tipo_utilizador,
      tipo_utilizador: user.tipo_utilizador,
    },
    process.env.JWT_SECRET || "urbaneye_secret",
    {
      expiresIn: "7d",
    }
  );
}
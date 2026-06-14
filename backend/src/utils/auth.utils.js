import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Guarda passwords com hash para nunca ficarem em texto simples.
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compara a password recebida com o hash guardado.
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Cria o token usado para identificar o utilizador nos pedidos seguintes.
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

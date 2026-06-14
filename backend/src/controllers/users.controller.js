import User from "../models/user.model.js";
import {
  validationError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
} from "../utils/error.utils.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/auth.utils.js";

// Regista um cidadão e protege a password antes de guardar.
export const createUser = async (req, res, next) => {
  try {
    const { nome, email, password, fotografia } = req.body;

    if (!nome || !email || !password) {
      throw validationError("Name, email and password are required.");
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw conflictError("Email already in use.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      nome,
      email,
      password: hashedPassword,
      tipo_utilizador: "cidadao",
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
    next(error);
  }
};

// Valida as credenciais e devolve a sessão ao frontend.
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw validationError("Email and password are required.");
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw unauthorizedError("Invalid credentials.");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw unauthorizedError("Invalid credentials.");
    }

    const token = generateToken(user);

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
    next(error);
  }
};

// Lista utilizadores sem expor as passwords.
export const getUsers = async (req, res, next) => {
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
    next(error);
  }
};

// Procura um utilizador específico pelo identificador.
export const getUserById = async (req, res, next) => {
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
      throw notFoundError("User");
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Atualiza apenas os campos recebidos no pedido.
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, password, fotografia, tipo_utilizador } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      throw notFoundError("User");
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        throw conflictError("Email already in use.");
      }
    }

    // Apenas gestores municipais podem alterar funções.
    if (tipo_utilizador !== undefined) {
      const currentUserRole = req.user?.role || req.user?.tipo_utilizador;

      if (currentUserRole !== "gestor_municipal") {
        throw forbiddenError("Only municipal managers can update user roles.");
      }

      if (!["cidadao", "moderador", "gestor_municipal", "tecnico"].includes(tipo_utilizador)) {
        throw validationError("Invalid user role.");
      }

      user.tipo_utilizador = tipo_utilizador;
    }

    if (nome !== undefined) user.nome = nome;
    if (email !== undefined) user.email = email;
    if (fotografia !== undefined) user.fotografia = fotografia;

    // Uma nova password também tem de ser guardada com hash.
    if (password !== undefined && password !== "") {
      user.password = await hashPassword(password);
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
    next(error);
  }
};

// Remove a conta depois de confirmar que existe.
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      throw notFoundError("User");
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

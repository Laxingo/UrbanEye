import api from "../services/api";

export async function login(email, password) {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  const { token, user } = response.data;

  const session = {
    token,
    id: user.id_utilizador,
    name: user.nome,
    email: user.email,
    role: user.tipo_utilizador,
    avatar: user.fotografia,
  };

  localStorage.setItem("session", JSON.stringify(session));

  return session;
}

export async function register(nome, email, password) {
  const response = await api.post("/users", {
    nome,
    email,
    password,
  });

  return response.data;
}

export function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}

export function isAuthenticated() {
  return !!getSession()?.token;
}

export function logout() {
  localStorage.removeItem("session");
}
import api from "../services/api";

// Inicia sessão e guarda apenas os dados usados pelo frontend.
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

// Cria uma nova conta de cidadão.
export async function register(nome, email, password) {
  const response = await api.post("/users", {
    nome,
    email,
    password,
  });

  return response.data;
}

// Lê a sessão atual guardada no navegador.
export function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}

// Confirma se existe um token para proteger as rotas privadas.
export function isAuthenticated() {
  return !!getSession()?.token;
}

// Termina a sessão local.
export function logout() {
  localStorage.removeItem("session");
}

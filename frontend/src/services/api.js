import axios from "axios";

// Instância comum para todos os pedidos feitos à API.
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Junta automaticamente o token da sessão aos pedidos autenticados.
api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("session"));

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export default api;

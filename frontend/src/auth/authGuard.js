import { isAuthenticated as checkAuth } from "./auth"

// Mantém uma entrada simples para verificações de autenticação.
export function isAuthenticated() {
  return checkAuth()
}

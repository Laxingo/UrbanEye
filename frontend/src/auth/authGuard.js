import { isAuthenticated as checkAuth } from "./auth"

export function isAuthenticated() {
  return checkAuth()
}
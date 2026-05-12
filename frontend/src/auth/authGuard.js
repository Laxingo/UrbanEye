export function isAuthenticated() {
  const session = JSON.parse(localStorage.getItem("session"))
  return session !== null
}

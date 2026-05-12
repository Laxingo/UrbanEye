export function initAdminAccount() {
  const users = JSON.parse(localStorage.getItem("users")) || []

  const adminExists = users.some(u => u.email === "admin@urbaneye.com")

  if (!adminExists) {
    users.push({
      name: "Administrator",
      email: "admin@urbaneye.com",
      password: "admin123",
      role: "admin",
      photo: "",
      verified: true // 🔥 Admin já vem verificado
    })

    localStorage.setItem("users", JSON.stringify(users))
  }

  // Criar sessão vazia se não existir
  if (!localStorage.getItem("session")) {
    localStorage.setItem("session", JSON.stringify(null))
  }
}

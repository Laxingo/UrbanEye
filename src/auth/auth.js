// --- BASIC AUTH SYSTEM (localStorage only) ---

export function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || []
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

export function registerUser(user) {
  const users = getUsers()

  // prevent duplicate email
  if (users.some(u => u.email === user.email)) {
    return { success: false, message: "Email already registered" }
  }

  // force role = user
  user.role = "user"

  users.push(user)
  saveUsers(users)

  return { success: true }
}

export function loginUser(email, password) {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return { success: false, message: "Invalid email or password" }
  }

  // Save session
  localStorage.setItem("session", JSON.stringify(user))

  return { success: true, user }
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("session"))
}

export function logoutUser() {
  localStorage.setItem("session", JSON.stringify(null))
}


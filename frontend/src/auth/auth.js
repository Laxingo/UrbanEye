import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api"
})

export async function registerUser(data) {
  try {
    const res = await api.post("/users", data)
    return res.data
  } catch (err) {
    return err.response?.data || {
      success: false,
      message: "Server error"
    }
  }
}

export async function loginUser(email, password) {
  try {
    const res = await api.post("/users/login", { email, password })
    return res.data
  } catch (err) {
    return err.response?.data || {
      success: false,
      message: "Server error"
    }
  }
}

export function logoutUser() {
  localStorage.removeItem("session")
}

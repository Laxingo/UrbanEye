<template>
  <div class="login-wrapper">
    <!-- Logo + Title -->
    <div class="header">
      <img src="/src/images/logo.png" alt="UrbanEye Logo" class="logo" />
      <p class="subtitle">Sign in to your account</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="form">
      <div class="field">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="field">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        
      </div>

      <div class="forgot">
        <a @click="$router.push('/recover')">Forgot your password?</a>
      </div>

      <button type="submit" class="btn-primary">Sign In</button>
    </form>

    <!-- Footer -->
    <p class="signup">
      Don’t have an account?
      <a @click="$router.push('/signup')">Sign Up</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { useToast } from "@/composables/useToast"
import { useLoading } from "@/composables/useLoading"
import { login } from "@/auth/auth"

const email = ref('')
const password = ref('')
const router = useRouter()

const { show } = useToast()
const { show: showLoading, hide: hideLoading } = useLoading()

// Valida o formulário e inicia a sessão.
async function handleLogin() {
  showLoading("Checking your credentials…")

  try {
    const session = await login(email.value, password.value)

    hideLoading()

    show("Welcome back!", "success")
    router.push("/dashboard")
  } catch (error) {
    hideLoading()

    const message =
      error.response?.data?.message || "Login failed. Please try again."

    show(message, "error")
  }
}
</script>



<style scoped>
/* Fullscreen layout */
.login-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  font-family: 'Inter', sans-serif;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 220px;
  margin-bottom: 12px;
}

.subtitle {
  margin-top: 6px;
  font-size: 18px;
  opacity: 0.75;
}

/* Form */
.form {
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  margin-bottom: 8px;
  opacity: 0.9;
}

input {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: white;
  font-size: 16px;
}

input::placeholder {
  color: #666;
}

input:focus {
  outline: none;
  border-color: #2D9CDB;
}

.forgot {
  width: 100%;
  text-align: right;
  margin-bottom: 20px;
}

.forgot a {
  color: #2D9CDB;
  font-size: 14px;
}

/* Button */
.btn-primary {
  width: 100%;
  padding: 16px;
  background: #2D9CDB;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
}

.btn-primary:hover {
  background: #1B6F99;
}

/* Footer */
.signup {
  margin-top: 30px;
  font-size: 16px;
  opacity: 0.85;
}

.signup a {
  color: #2D9CDB;
  font-weight: 500;
}
</style>

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

      <button type="submit" class="btn-primary" @click="$router.push('/dashboard')">Sign In</button>
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

const email = ref('')
const password = ref('')

function handleLogin() {
  console.log('Login:', email.value, password.value)
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
  margin-bottom: 40px; /* smaller spacing */
}

.logo {
  width: 220px; /* smaller logo */
  margin-bottom: 12px;
}

.subtitle {
  margin-top: 6px;
  font-size: 18px; /* smaller subtitle */
  opacity: 0.75;
}

/* Form */
.form {
  width: 340px; /* smaller form */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; /* smaller spacing */
}

label {
  font-size: 16px; /* smaller label */
  margin-bottom: 8px;
  opacity: 0.9;
}

input {
  padding: 14px; /* smaller input */
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: white;
  font-size: 16px; /* smaller text */
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
  padding: 16px; /* smaller button */
  background: #2D9CDB;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px; /* smaller text */
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

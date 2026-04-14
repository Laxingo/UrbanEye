<template>
  <div class="signup-wrapper">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Join Urban Eye today</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSignup" class="form">
      <div class="field">
        <label>Full Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name"
          required
        />
      </div>

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

      <div class="field">
        <label>Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
        />
      </div>

      <button type="submit" class="btn-primary" @click="$router.push('/verify')">Sign Up</button>
    </form>

    <!-- Footer -->
    <p class="signin">
      Already have an account?
      <a @click="$router.push('/')">Sign In</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleSignup() {
  console.log('Signup:', name.value, email.value, password.value, confirmPassword.value)
}
</script>

<style scoped>
/* Fullscreen layout */
.signup-wrapper {
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
  margin-bottom: 40px; /* smaller */
}

.title {
  font-size: 32px; /* smaller */
  font-weight: 700;
  margin: 0;
}

.subtitle {
  margin-top: 6px;
  font-size: 18px; /* smaller */
  opacity: 0.75;
}

/* Form */
.form {
  width: 340px; /* smaller */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px; /* smaller */
}

label {
  font-size: 16px; /* smaller */
  margin-bottom: 8px;
  opacity: 0.9;
}

input {
  padding: 14px; /* smaller */
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: white;
  font-size: 16px; /* smaller */
}

input::placeholder {
  color: #666;
}

input:focus {
  outline: none;
  border-color: #2D9CDB;
}

/* Button */
.btn-primary {
  width: 100%;
  padding: 16px; /* smaller */
  background: #2D9CDB;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px; /* smaller */
}

.btn-primary:hover {
  background: #1B6F99;
}

/* Footer */
.signin {
  margin-top: 30px; /* smaller */
  font-size: 16px;
  opacity: 0.85;
}

.signin a {
  color: #2D9CDB;
  font-weight: 500;
}
</style>

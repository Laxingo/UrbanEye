<template>
  <div class="recover-wrapper">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Recover Password</h1>
      <p class="subtitle">Enter your email to receive reset instructions</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleRecover" class="form">
      <div class="field">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <button type="submit" class="btn-primary">Send Reset Link</button>
    </form>

    <!-- Footer -->
    <p class="back">
      <a @click="$router.push('/')">Back to login</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "@/composables/useToast"
import { useLoading } from "@/composables/useLoading"

const email = ref('')
const router = useRouter()

const { show } = useToast()
const { show: showLoading, hide: hideLoading } = useLoading()

async function handleRecover() {
  if (!email.value) {
    show("Please enter your email", "warning")
    return
  }

  showLoading("Sending reset link…")

  // Simular envio
  await new Promise(resolve => setTimeout(resolve, 1200))

  hideLoading()

  show("Reset link sent to your email", "info")

  router.push('/email-sent')
}
</script>

<style scoped>
/* Fullscreen layout */
.recover-wrapper {
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

.title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
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
.back {
  margin-top: 30px;
  font-size: 16px;
  opacity: 0.85;
}

.back a {
  color: #2D9CDB;
  font-weight: 500;
  cursor: pointer;
}
</style>

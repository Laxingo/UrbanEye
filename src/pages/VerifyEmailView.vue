<template>
  <div class="verify-wrapper">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Verify Your Email</h1>
      <p class="subtitle">Enter the 6-digit code sent to your email</p>
    </div>

    <!-- Code Inputs -->
    <div class="code-container">
      <input
        v-for="(digit, index) in code"
        :key="index"
        type="text"
        maxlength="1"
        class="code-box"
        v-model="code[index]"
        @input="focusNext(index)"
      />
    </div>

    <!-- Button -->
    <button class="btn-primary" @click="handleVerify">Verify</button>

    <!-- Footer -->
    <p class="resend">
      Didn’t receive the code?
      <a @click="resendCode">Resend</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "@/composables/useToast"
import { useLoading } from "@/composables/useLoading"

const router = useRouter()
const { show } = useToast()
const { show: showLoading, hide: hideLoading } = useLoading()

const code = ref(["", "", "", "", "", ""])

function focusNext(index) {
  if (code.value[index].length === 1 && index < 5) {
    const next = document.querySelectorAll(".code-box")[index + 1]
    next.focus()
  }
}

async function handleVerify() {
  const entered = code.value.join("")

  if (entered.length !== 6) {
    show("Enter all 6 digits", "warning")
    return
  }

  if (entered !== "123456") {
    show("Invalid verification code", "error")
    return
  }

  const email = localStorage.getItem("pendingVerifyEmail")
  if (!email) {
    show("No pending verification", "error")
    return
  }

  showLoading("Verifying your account…")

  // Simular tempo de verificação
  await new Promise(resolve => setTimeout(resolve, 1200))

  const users = JSON.parse(localStorage.getItem("users"))
  const user = users.find(u => u.email === email)

  if (user) {
    user.verified = true
    localStorage.setItem("users", JSON.stringify(users))

    // Criar sessão automaticamente
    localStorage.setItem("session", JSON.stringify(user))
  }

  localStorage.removeItem("pendingVerifyEmail")

  hideLoading()

  show("Email verified successfully!", "success")

  router.push("/dashboard")
}

function resendCode() {
  show("A new code would be sent (static mode)", "info")
}
</script>

<style scoped>
.verify-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  font-family: Inter, sans-serif;
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

/* Code boxes */
.code-container {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.code-box {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: white;
}

.code-box:focus {
  outline: none;
  border-color: #2D9CDB;
}

/* Button */
.btn-primary {
  width: 340px;
  padding: 16px;
  background: #2D9CDB;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
  margin-top: 10px;
}

.btn-primary:hover {
  background: #1B6F99;
}

/* Footer */
.resend {
  margin-top: 30px;
  font-size: 16px;
  opacity: 0.85;
}

.resend a {
  color: #2D9CDB;
  cursor: pointer;
  font-weight: 500;
}
</style>

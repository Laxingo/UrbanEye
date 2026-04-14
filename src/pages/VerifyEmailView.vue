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

const code = ref(["", "", "", "", "", ""])

function focusNext(index) {
  if (code.value[index].length === 1 && index < 5) {
    const next = document.querySelectorAll(".code-box")[index + 1]
    next.focus()
  }
}

function handleVerify() {
  console.log("Code entered:", code.value.join(""))
}

function resendCode() {
  console.log("Resend code")
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

/* Code boxes */
.code-container {
  display: flex;
  gap: 12px; /* smaller */
  margin-bottom: 30px; /* smaller */
}

.code-box {
  width: 48px; /* smaller */
  height: 56px; /* smaller */
  text-align: center;
  font-size: 24px; /* smaller */
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
  width: 340px; /* smaller */
  padding: 16px; /* smaller */
  background: #2D9CDB;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px; /* smaller */
  margin-top: 10px;
}

.btn-primary:hover {
  background: #1B6F99;
}

/* Footer */
.resend {
  margin-top: 30px; /* smaller */
  font-size: 16px;
  opacity: 0.85;
}

.resend a {
  color: #2D9CDB;
  cursor: pointer;
  font-weight: 500;
}
</style>

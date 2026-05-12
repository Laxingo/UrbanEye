<template>
  <div class="sent-wrapper">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Email Sent</h1>
      <p class="subtitle">
        We’ve sent reset instructions to your email.<br />
        Please check your inbox.
      </p>
    </div>

    <!-- Button -->
    <button class="btn-primary" @click="$router.push('/')">
      Back to Login
    </button>

    <!-- Footer -->
    <p class="resend">
      Didn’t receive the email?
      <a @click="resendEmail">Resend</a>
    </p>
  </div>
</template>

<script setup>
function resendEmail() {
  console.log("Resend email clicked")
}
</script>

<style scoped>
.sent-wrapper {
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
  line-height: 1.4;
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

<template>
  <transition name="fade">
    <div v-if="isLoading" class="overlay">
      <div class="loader">
        <div class="spinner"></div>
        <p class="message">{{ loadingMessage }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useLoading } from "@/composables/useLoading"
const { isLoading, loadingMessage } = useLoading()
</script>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(14px);
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

/* Loader container */
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

/* Neon spinner */
.spinner {
  width: 70px;
  height: 70px;
  border: 4px solid rgba(255, 255, 255, 0.15);
  border-top-color: #2D9CDB;
  border-radius: 50%;
  animation: spin 0.9s linear infinite, glow 1.4s ease-in-out infinite;
}

/* Spinner rotation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Neon glow pulse */
@keyframes glow {
  0% {
    box-shadow: 0 0 6px #2D9CDB;
  }
  50% {
    box-shadow: 0 0 18px #2D9CDB;
  }
  100% {
    box-shadow: 0 0 6px #2D9CDB;
  }
}

.message {
  font-size: 18px;
  color: white;
  opacity: 0.9;
  font-weight: 500;
}
</style>

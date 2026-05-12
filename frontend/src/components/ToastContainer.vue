<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
      @click="handleClick(toast)"
    >
      <component :is="icons[toast.type]" class="icon" />

      <div class="content">
        <span class="message">{{ toast.message }}</span>

        <!-- Progress bar -->
        <div
          v-if="toast.duration"
          class="progress"
          :style="{ animationDuration: toast.duration + 'ms' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "@/composables/useToast"
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from "@heroicons/vue/24/solid"

const { toasts, remove } = useToast()

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  loading: ArrowPathIcon
}

function handleClick(toast) {
  if (toast.action) toast.action()
  if (!toast.duration) return // persistente → não fecha ao clicar
  remove(toast.id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 9999;
}

/* Toast base */
.toast {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 280px;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  color: white;
  backdrop-filter: blur(12px);
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  animation: slideIn 0.35s ease;
  position: relative;
}

.icon {
  width: 22px;
  height: 22px;
}

/* Types */
.toast.success { border-left: 4px solid #2ecc71; }
.toast.error { border-left: 4px solid #e74c3c; }
.toast.info { border-left: 4px solid #3498db; }
.toast.warning { border-left: 4px solid #f1c40f; }
.toast.loading { border-left: 4px solid #9b59b6; }

/* Progress bar */
.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  animation: shrink linear forwards;
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* Animations */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>

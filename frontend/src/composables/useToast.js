import { ref } from "vue"

const toasts = ref([])

export function useToast() {
  function show(message, type = "info", options = {}) {
    const id = Date.now()

    // Stack inteligente: máximo 3
    if (toasts.value.length >= 3) {
      toasts.value.shift()
    }

    const toast = {
      id,
      message,
      type,
      duration: options.persistent ? null : 3000,
      action: options.action || null
    }

    toasts.value.push(toast)

    // Auto-remove se não for persistente
    if (toast.duration) {
      setTimeout(() => remove(id), toast.duration)
    }
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, remove }
}

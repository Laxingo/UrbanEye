import { ref } from "vue"

const isLoading = ref(false)
const loadingMessage = ref("")

export function useLoading() {
  function show(message = "Loading…") {
    loadingMessage.value = message
    isLoading.value = true
  }

  function hide() {
    isLoading.value = false
    loadingMessage.value = ""
  }

  return { isLoading, loadingMessage, show, hide }
}

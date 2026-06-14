import { ref } from "vue"

const isLoading = ref(false)
const loadingMessage = ref("")

// Estado global usado pelo overlay de carregamento.
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

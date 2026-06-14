<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Create Category</h2>

      <div class="form">
        <label>Name</label>
        <input v-model="category.name" type="text" />

        <label>Description</label>
        <textarea v-model="category.description"></textarea>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button class="save-btn" @click="saveCategory" :disabled="loading">
        {{ loading ? "Saving..." : "Save" }}
      </button>

      <button class="close-btn" @click="$emit('close')" :disabled="loading">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import api from "@/services/api.js"

const emit = defineEmits(["close", "category-created"])

const category = ref({
  name: "",
  description: ""
})

const loading = ref(false)
const errorMessage = ref("")

// Valida e cria uma nova categoria.
async function saveCategory() {
  errorMessage.value = ""

  if (!category.value.name.trim()) {
    errorMessage.value = "Category name is required."
    return
  }

  loading.value = true

  try {
    await api.post("/categories", {
      nome_categoria: category.value.name,
      descricao_categoria: category.value.description || null
    })

    emit("category-created")
  } catch (error) {
    console.error("Error creating category:", error)
    errorMessage.value =
      error.response?.data?.message || "Error creating category."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #111;
  padding: 24px;
  width: 360px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

input,
textarea {
  background: #222;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 6px;
  color: #fff;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.save-btn {
  width: 100%;
  background: #2d9cdb;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
  margin-bottom: 10px;
  cursor: pointer;
}

.save-btn:disabled,
.close-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-btn {
  width: 100%;
  background: #444;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
}

.error-message {
  color: #eb5757;
  font-size: 14px;
  margin-bottom: 12px;
}
</style>

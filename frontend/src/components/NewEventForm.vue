<template>
  <div class="overlay" @click.self="close">
    <div class="modal">
      <h2 class="title">Create New Event</h2>

      <div class="form">
        <input
          v-model="form.title"
          type="text"
          placeholder="Event Title"
        />

        <textarea
          v-model="form.description"
          placeholder="Description"
        ></textarea>

        <select v-model="form.categoryId">
          <option disabled value="">Category</option>
          <option
            v-for="category in categories"
            :key="category.id_categoria"
            :value="category.id_categoria"
          >
            {{ category.nome_categoria }}
          </option>
        </select>

        <input
          v-model="form.location"
          type="text"
          placeholder="Location description"
        />

        <input
          v-model.number="form.latitude"
          type="number"
          step="any"
          placeholder="Latitude"
        />

        <input
          v-model.number="form.longitude"
          type="number"
          step="any"
          placeholder="Longitude"
        />

        <select v-model="form.priority">
          <option disabled value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div class="actions">
        <button class="cancel" @click="close" :disabled="loading">
          Cancel
        </button>

        <button class="create" @click="submit" :disabled="loading">
          {{ loading ? "Creating..." : "Create Event" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api.js"

const emit = defineEmits(["close", "submit"])

const categories = ref([])
const loading = ref(false)
const errorMessage = ref("")

const form = ref({
  title: "",
  description: "",
  categoryId: "",
  location: "",
  latitude: "",
  longitude: "",
  priority: ""
})

function close() {
  emit("close")
}

async function loadCategories() {
  try {
    const response = await api.get("/categories")

    categories.value = Array.isArray(response.data)
      ? response.data
      : response.data.categories || []
  } catch (error) {
    console.error("Error loading categories:", error)
    errorMessage.value = "Error loading categories."
  }
}

function validateForm() {
  if (!form.value.title.trim()) return "Event title is required."
  if (!form.value.description.trim()) return "Description is required."
  if (!form.value.categoryId) return "Category is required."
  if (!form.value.location.trim()) return "Location is required."
  if (form.value.latitude === "" || form.value.latitude === null) return "Latitude is required."
  if (form.value.longitude === "" || form.value.longitude === null) return "Longitude is required."
  if (!form.value.priority) return "Priority is required."

  return null
}

async function submit() {
  errorMessage.value = ""

  const validationError = validateForm()

  if (validationError) {
    errorMessage.value = validationError
    return
  }

  loading.value = true

  try {
    const selectedCategory = categories.value.find(
      category => Number(category.id_categoria) === Number(form.value.categoryId)
    )

    await api.post("/events", {
      descricao: `${form.value.title} — ${form.value.description}`,
      latitude: Number(form.value.latitude),
      longitude: Number(form.value.longitude),
      descricao_local: form.value.location,
      id_categoria: Number(form.value.categoryId)
    })

    emit("submit", {
      title: form.value.title,
      description: form.value.description,
      category: selectedCategory?.nome_categoria || "Unknown",
      categoryId: form.value.categoryId,
      location: form.value.location,
      coords: [Number(form.value.latitude), Number(form.value.longitude)],
      priority: form.value.priority,
      date: new Date().toLocaleString(),
      status: "pending"
    })
  } catch (error) {
    console.error("Error creating event:", error)
    errorMessage.value =
      error.response?.data?.message || "Error creating event."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  z-index: 9999;
}

.modal {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 28px;
  width: 420px;
  animation: slideUp 0.25s ease;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

input,
textarea,
select {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px;
  color: #fff;
  font-size: 14px;
}

textarea {
  height: 80px;
  resize: none;
}

.error-message {
  margin-top: 12px;
  color: #eb5757;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel {
  background: #000;
  border: 1px solid #2a2a2a;
  padding: 10px 18px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.create {
  background: #2d9cdb;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}

.cancel:disabled,
.create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
</style>
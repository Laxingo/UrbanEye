<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="modal-title">Create Team</h2>

      <div class="form">
        <label>Name</label>
        <input v-model="team.name" type="text" />

        <label>Responsible Entity ID</label>
        <input v-model.number="team.id_entidade" type="number" />

        <p class="helper">
          Use the ID from the responsible entity table.
        </p>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <button class="save-btn" @click="saveTeam" :disabled="loading">
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

const emit = defineEmits(["close", "team-created"])

const team = ref({
  name: "",
  id_entidade: null
})

const loading = ref(false)
const errorMessage = ref("")

// Valida e cria uma nova equipa.
async function saveTeam() {
  errorMessage.value = ""

  if (!team.value.name.trim() || !team.value.id_entidade) {
    errorMessage.value = "Team name and responsible entity are required."
    return
  }

  loading.value = true

  try {
    await api.post("/teams", {
      nome_equipa: team.value.name,
      id_entidade: team.value.id_entidade
    })

    emit("team-created")
  } catch (error) {
    console.error("Error creating team:", error)
    errorMessage.value =
      error.response?.data?.message || "Error creating team."
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

input {
  background: #222;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 6px;
  color: #fff;
}

.helper {
  font-size: 12px;
  color: #aaa;
  margin-top: -4px;
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

.close-btn {
  width: 100%;
  background: #444;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #fff;
  cursor: pointer;
}

.save-btn:disabled,
.close-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #eb5757;
  font-size: 14px;
  margin-bottom: 12px;
}
</style>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="title">Forward Event</h2>

      <div class="event-info" v-if="event">
        <p><strong>Event:</strong> {{ event.title }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
      </div>

      <div class="form">
        <label>Team</label>
        <select v-model="selectedTeamId" :class="{ error: errors.team }">
          <option disabled value="">Select a team</option>
          <option
            v-for="team in teams"
            :key="team.id_equipa"
            :value="team.id_equipa"
          >
            {{ team.nome_equipa }}
          </option>
        </select>
        <p v-if="errors.team" class="error-text">{{ errors.team }}</p>

        <label>Status</label>
        <select v-model="status">
          <option value="pendente">Pendente</option>
          <option value="em_analise">Em análise</option>
          <option value="resolvido">Resolvido</option>
        </select>

        <label>Description</label>
        <textarea
          v-model="description"
          placeholder="Add forwarding notes..."
        ></textarea>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div class="actions">
        <button class="cancel" @click="$emit('close')" :disabled="loading">
          Cancel
        </button>

        <button class="save" :disabled="!isValid || loading" @click="save">
          {{ loading ? "Forwarding..." : "Forward" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api.js"

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(["close", "forwarding-created"])

const selectedTeamId = ref("")
const status = ref("pendente")
const description = ref("")

const teams = ref([])
const loading = ref(false)
const errorMessage = ref("")

const errors = ref({
  team: null
})

const isValid = computed(() => {
  errors.value.team = selectedTeamId.value ? null : "Team is required"
  return Object.values(errors.value).every(error => error === null)
})

async function loadTeams() {
  try {
    const response = await api.get("/teams")

    teams.value = Array.isArray(response.data)
      ? response.data
      : response.data.teams || []
  } catch (error) {
    console.error("Error loading teams:", error)
    errorMessage.value =
      error.response?.data?.message || "Error loading teams."
  }
}

async function save() {
  if (!isValid.value) return

  loading.value = true
  errorMessage.value = ""

  try {
    await api.post(`/events/${props.event.id}/forwardings`, {
      teamId: Number(selectedTeamId.value),
      status: status.value
    })

    emit("forwarding-created")
    emit("close")
  } catch (error) {
    console.error("Error creating forwarding:", error)
    errorMessage.value =
      error.response?.data?.message || "Error creating forwarding."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTeams()
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease;
  z-index: 9999;
}

.modal {
  background: #0f0f0f;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 20px;
  width: 380px;
  animation: slideUp 0.2s ease;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
}

.event-info {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 14px;
  font-size: 13px;
  opacity: 0.9;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 12px;
  opacity: 0.75;
}

textarea,
select {
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 8px;
  color: #fff;
  font-size: 13px;
}

textarea {
  height: 60px;
}

.error {
  border-color: #eb5757 !important;
}

.error-text,
.error-message {
  color: #eb5757;
  font-size: 11px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

.cancel,
.save {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.cancel {
  background: #000;
  border: 1px solid #333;
  color: #ccc;
}

.save {
  background: #2d9cdb;
  border: none;
  color: #fff;
  font-weight: 600;
}

.save:disabled,
.cancel:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
</style>
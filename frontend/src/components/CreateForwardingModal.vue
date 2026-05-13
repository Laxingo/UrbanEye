<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="title">Forward Event</h2>

      <div class="form">

        <label>Team</label>
        <select v-model="team" :class="{ error: errors.team }">
          <option disabled value="">Select a team</option>
          <option v-for="t in teams" :key="t.id">{{ t.name }}</option>
        </select>
        <p v-if="errors.team" class="error-text">{{ errors.team }}</p>

        <label>Description</label>
        <textarea
          v-model="description"
          :class="{ error: errors.description }"
          placeholder="Add forwarding notes..."
        ></textarea>
        <p v-if="errors.description" class="error-text">{{ errors.description }}</p>

      </div>

      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>
        <button class="save" :disabled="!isValid" @click="save">Forward</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

const props = defineProps({
  event: Object
})

const emit = defineEmits(["close"])

/* FORM FIELDS */
const team = ref("")
const description = ref("")

/* TEAMS LIST */
const teams = ref([])

onMounted(() => {
  teams.value = JSON.parse(localStorage.getItem("teams")) || []
})

/* VALIDATION */
const errors = ref({
  team: null,
  description: null
})

function validate() {
  errors.value.team = team.value ? null : "Team is required"
  errors.value.description = description.value.trim()
    ? null
    : "Description is required"
}

const isValid = computed(() => {
  validate()
  return Object.values(errors.value).every(e => e === null)
})

/* SAVE FORWARDING */
function save() {
  const stored = JSON.parse(localStorage.getItem("forwardings")) || []

  stored.push({
    id: Date.now(),
    eventId: props.event.id,
    eventTitle: props.event.title,
    team: team.value,
    description: description.value,
    forwardedAt: new Date().toLocaleString()
  })

  localStorage.setItem("forwardings", JSON.stringify(stored))

  window.dispatchEvent(new Event("forwardings-updated"))
  emit("close")
}
</script>

<style scoped>
/* OVERLAY */
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

/* MODAL */
.modal {
  background: #0f0f0f;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 20px;
  width: 360px;
  animation: slideUp 0.2s ease;
}

/* TITLE */
.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-size: 12px;
  opacity: 0.75;
}

/* INPUTS */
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

/* ERROR */
.error {
  border-color: #eb5757 !important;
}

.error-text {
  color: #eb5757;
  font-size: 11px;
  margin-top: -6px;
}

/* ACTION BUTTONS */
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

.save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
</style>

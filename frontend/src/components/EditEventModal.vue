<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2 class="title">Edit Event</h2>

      <div class="form">

        <label>Event Title</label>
        <input v-model="local.title" type="text" :class="{ error: errors.title }" />
        <p v-if="errors.title" class="error-text">{{ errors.title }}</p>

        <label>Description</label>
        <textarea v-model="local.description" :class="{ error: errors.description }"></textarea>
        <p v-if="errors.description" class="error-text">{{ errors.description }}</p>

        <label>Category</label>
        <select v-model="local.category" :class="{ error: errors.category }">
          <option>Infrastructure</option>
          <option>Traffic</option>
          <option>Environment</option>
          <option>Security</option>
          <option>Health</option>
        </select>
        <p v-if="errors.category" class="error-text">{{ errors.category }}</p>

        <label>Location</label>
        <input v-model="local.location" type="text" :class="{ error: errors.location }" />
        <p v-if="errors.location" class="error-text">{{ errors.location }}</p>

        <label>Priority</label>
        <select v-model="local.priority" :class="{ error: errors.priority }">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <p v-if="errors.priority" class="error-text">{{ errors.priority }}</p>

        <label>Reported By</label>
        <input v-model="local.reportedBy" type="text" :class="{ error: errors.reportedBy }" />
        <p v-if="errors.reportedBy" class="error-text">{{ errors.reportedBy }}</p>

        <label>Date</label>
        <input v-model="local.date" type="text" :class="{ error: errors.date }" />
        <p v-if="errors.date" class="error-text">{{ errors.date }}</p>

      </div>

      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>

        <!-- 🔥 NOVO BOTÃO FORWARD -->
        <button class="save" @click="emit('forward', local)">
          Forward
        </button>

        <button class="save" :disabled="!isValid" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  event: Object
})

/* 🔥 AGORA O MODAL EMITE O EVENTO FORWARD */
const emit = defineEmits(['close', 'save', 'forward'])

/* LOCAL COPY */
const local = reactive({ ...props.event })

watch(() => props.event, newEvent => {
  Object.assign(local, {
    ...newEvent,
    coords: newEvent.coords   // preserva coords ao atualizar o modal
  })
})

/* VALIDATION */
const errors = reactive({
  title: null,
  description: null,
  category: null,
  location: null,
  priority: null,
  reportedBy: null,
  date: null
})

function validate() {
  errors.title = local.title?.trim() ? null : "Title is required"
  errors.description = local.description?.trim() ? null : "Description is required"
  errors.category = local.category ? null : "Category is required"
  errors.location = local.location?.trim() ? null : "Location is required"
  errors.priority = local.priority ? null : "Priority is required"
  errors.reportedBy = local.reportedBy?.trim() ? null : "Reporter is required"
  errors.date = local.date?.trim() ? null : "Date is required"
}

watch(local, validate, { deep: true })

const isValid = computed(() => Object.values(errors).every(e => e === null))

/* FIX: ALWAYS SEND VALID COORDS */
function save() {
  emit('save', {
    ...local,
    coords: local.coords
  })
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
input,
textarea,
select {
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 8px;
  color: #fff;
  font-size: 13px;
  transition: border-color 0.2s ease;
}

textarea {
  height: 60px;
}

/* ERROR STATE */
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
  transition: opacity 0.2s ease;
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

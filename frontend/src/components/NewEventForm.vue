<template>
  <div class="overlay" @click.self="close">
    <div class="modal">
      <h2 class="title">Create New Event</h2>

    <div class="form">
      <input v-model="form.title" type="text" placeholder="Event Title" />

      <textarea v-model="form.description" placeholder="Description"></textarea>

      <select v-model="form.category">
        <option disabled value="">Category</option>
        <option>Infrastructure</option>
        <option>Traffic</option>
        <option>Environment</option>
        <option>Security</option>
        <option>Health</option>
      </select>

      <input v-model="form.location" type="text" placeholder="Location" />

      <select v-model="form.priority">
        <option disabled value="">Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input v-model="form.reportedBy" type="text" placeholder="Reported By" />
    </div>


      <div class="actions">
        <button class="cancel" @click="close">Cancel</button>
        <button class="create" @click="submit">Create Event</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
  category: '',
  location: '',
  priority: '',
  reportedBy: ''
})

function close() {
  emit('close')
}

function submit() {
  emit('submit', {
    ...form,
    date: new Date().toLocaleString() // auto timestamp
  })
}
</script>

<style scoped>
/* OVERLAY */
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

/* MODAL */
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

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  font-size: 14px;
  opacity: 0.8;
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

/* ACTION BUTTONS */
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

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
</style>

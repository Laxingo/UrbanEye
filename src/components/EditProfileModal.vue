<template>
  <div class="overlay">
    <div class="modal">

      <!-- AVATAR -->
      <div
        class="avatar"
        :style="{ backgroundImage: local.photo ? `url(${local.photo})` : '' }"
      >
        <span v-if="!local.photo">U</span>
      </div>

      <label class="change-photo">
        Change Photo
        <input type="file" accept="image/*" @change="onPhotoChange" hidden />
      </label>

      <!-- FORM -->
      <div class="form">
        <label>
          Full Name
          <input v-model="local.name" type="text" placeholder="Enter your full name" />
        </label>

        <label>
          Email
          <input v-model="local.email" type="email" placeholder="Enter email address" />
        </label>

        <label>
          Phone
          <input v-model="local.phone" type="text" placeholder="Enter phone number" />
        </label>

        <label>
          Location
          <input v-model="local.location" type="text" placeholder="Enter location" />
        </label>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>
        <button class="save" @click="saveChanges">Save Changes</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  profile: Object
})

const emit = defineEmits(['close', 'save'])

const local = reactive({ ...props.profile })

function saveChanges() {
  emit('save', { ...local })
}

function onPhotoChange(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    local.photo = reader.result
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
/* OVERLAY */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  z-index: 2000;
}

/* MODAL */
.modal {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 32px;
  width: 420px;
  animation: slideUp 0.25s ease;
  text-align: center;
}

/* AVATAR */
.avatar {
  width: 80px;
  height: 80px;
  background: #2d9cdb;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 12px;
  overflow: hidden;
}

.change-photo {
  display: inline-block;
  color: #2d9cdb;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 24px;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #ccc;
}

input {
  margin-top: 6px;
  background: #111;
  border: 1px solid #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
}

input:focus {
  border-color: #2d9cdb;
  outline: none;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
}

.cancel {
  background: none;
  border: 1px solid #444;
  padding: 10px 18px;
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
}

.save {
  background: #2d9cdb;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
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

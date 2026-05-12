<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">


      <!-- TOP BAR WITH PEN + TRASH ICON -->
      <div class="top-bar">
        <h2 class="title">{{ props.event.title }}</h2>

        <div class="top-actions">

          <!-- EDIT (PEN ICON) -->
          <button
            class="icon-btn"
            v-if="canEdit"
            @click="$emit('edit', props.event)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>

          <!-- DELETE (TRASH ICON) -->
          <button
            class="icon-btn delete"
            v-if="canDelete"
            @click="$emit('delete', props.event.id)"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>

        </div>
      </div>

      <!-- INFO GRID -->
      <div class="info-grid">
        <div class="info-item">
          <strong>Category</strong>
          <p>{{ props.event.category }}</p>
        </div>

        <div class="info-item">
          <strong>Location</strong>
          <p>{{ props.event.location }}</p>
        </div>

        <div class="info-item">
          <strong>Priority</strong>
          <p>{{ props.event.priority }}</p>
        </div>

        <div class="info-item">
          <strong>Reported By</strong>
          <p>{{ props.event.reportedBy }}</p>
        </div>

        <div class="info-item">
          <strong>Date</strong>
          <p>{{ props.event.date }}</p>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="description-box">
        <strong>Description</strong>
        <p>{{ props.event.description }}</p>
      </div>

      <!-- BOTTOM ACTION BUTTONS -->
      <div class="bottom-actions">

        <!-- ANY USER CAN CONFIRM/REJECT -->
        <button
          class="confirm-btn"
          v-if="props.event.status === 'pending'"
          @click="$emit('confirm', props.event)"
        >
          Confirm
        </button>

        <button
          class="reject-btn"
          v-if="props.event.status === 'pending'"
          @click="$emit('reject', props.event)"
        >
          Reject
        </button>

        <!-- ONLY ADMINS CAN FORWARD -->
        <button
          class="forward-btn"
          v-if="props.event.status === 'confirmed' && props.isAdmin"
          @click="$emit('forward', props.event)"
        >
          Forward
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  event: Object,
  isAdmin: Boolean,
  currentUserEmail: String
})

/*
  PERMISSIONS:
  - Admin pode tudo
  - Criador do evento pode editar e apagar
  - Confirmar/Rejeitar → qualquer utilizador
*/

const canEdit = computed(() =>
  props.isAdmin || props.event.reportedBy === props.currentUserEmail
)

const canDelete = computed(() =>
  props.isAdmin || props.event.reportedBy === props.currentUserEmail
)
</script>

<style scoped>
/* OVERLAY */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
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
  padding: 24px;
  width: 480px;
  animation: slideUp 0.25s ease;
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-actions {
  display: flex;
  gap: 10px;
}

/* ICON BUTTONS */
.icon-btn {
  background: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  transition: 0.2s;
}

.icon-btn:hover {
  color: #fff;
  transform: scale(1.1);
}

.icon-btn.delete {
  color: #eb5757;
}

.icon-btn.delete:hover {
  color: #ff6b6b;
}

/* TITLE */
.title {
  font-size: 22px;
  font-weight: 600;
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 20px 0;
}

.info-item strong {
  font-size: 14px;
  color: #ccc;
}

.info-item p {
  margin-top: 4px;
  opacity: 0.8;
}

/* DESCRIPTION */
.description-box strong {
  font-size: 14px;
  color: #ccc;
}

.description-box p {
  margin-top: 6px;
  opacity: 0.8;
}

/* BOTTOM ACTION BUTTONS */
.bottom-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 28px;
}

.confirm-btn,
.reject-btn,
.forward-btn {
  flex: 1;
  margin: 0 4px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
}

.confirm-btn {
  background: #27ae60;
}

.reject-btn {
  background: #eb5757;
}

.forward-btn {
  background: #2d9cdb;
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

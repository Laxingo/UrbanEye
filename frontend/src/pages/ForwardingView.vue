<template>
  <div class="forwarding-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.photo"
        :isUser="true"
        @open-create-forwarding="showCreateModal = true"
      />

      <div class="content">
        <div class="container">

          <!-- HEADER -->
          <div class="header-row">
            <h2 class="title">Forwardings</h2>
          </div>

          <!-- LIST -->
          <div class="list">
            <div
              class="forwarding-card"
              v-for="item in forwardings"
              :key="item.id"
            >
              <div class="left">
                <div class="icon-box">
                  <ArrowPathIcon class="icon" />
                </div>

                <div>
                  <h3 class="f-title">{{ item.eventTitle }}</h3>
                  <p class="f-desc">
                    Forwarded to <strong>{{ item.team }}</strong>
                  </p>
                  <p class="f-desc">{{ item.description }}</p>
                </div>
              </div>

              <div class="right">
                <p class="date">{{ item.forwardedAt }}</p>

                <button class="view-btn" @click="openModal(item)">
                  View
                </button>

                <!-- DELETE BUTTON -->
                <button class="delete-btn" @click="deleteForwarding(item.id)">
                  Delete
                </button>
              </div>
            </div>

            <p v-if="forwardings.length === 0" class="empty">
              No forwardings created yet.
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ selectedForwarding.eventTitle }}</h2>

        <p class="modal-desc">
          <strong>Team:</strong> {{ selectedForwarding.team }}
        </p>

        <p class="modal-desc">
          <strong>Description:</strong> {{ selectedForwarding.description }}
        </p>

        <div class="modal-info">
          <p><strong>ID:</strong> {{ selectedForwarding.id }}</p>
          <p><strong>Event ID:</strong> {{ selectedForwarding.eventId }}</p>
          <p><strong>Forwarded at:</strong> {{ selectedForwarding.forwardedAt }}</p>
        </div>

        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>

    <!-- CREATE FORWARDING MODAL -->
    <CreateForwardingModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"
import CreateForwardingModal from "@/components/CreateForwardingModal.vue"

import { ArrowPathIcon } from "@heroicons/vue/24/outline"

const forwardings = ref([])
const session = ref({})

const showModal = ref(false)
const selectedForwarding = ref(null)

const showCreateModal = ref(false)

function openModal(item) {
  selectedForwarding.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function loadForwardings() {
  forwardings.value = JSON.parse(localStorage.getItem("forwardings")) || []
}

/* DELETE FORWARDING */
function deleteForwarding(id) {
  const stored = JSON.parse(localStorage.getItem("forwardings")) || []
  const updated = stored.filter(f => f.id !== id)

  localStorage.setItem("forwardings", JSON.stringify(updated))
  forwardings.value = updated
}

onMounted(() => {
  const s = JSON.parse(localStorage.getItem("session"))
  session.value = s || {}

  loadForwardings()

  // Atualiza automaticamente quando um forwarding é criado
  window.addEventListener("forwardings-updated", loadForwardings)
})
</script>

<style scoped>
.forwarding-page {
  display: flex;
  height: 100vh;
  background: #000;
  color: #fff;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  overflow-y: auto;
}

.container {
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
}

/* HEADER */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
}

/* LIST */
.list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forwarding-card {
  background: #111;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.icon-box {
  width: 50px;
  height: 50px;
  background: #2d9cdb33;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 28px;
  height: 28px;
  color: #2d9cdb;
}

.f-title {
  font-size: 20px;
  font-weight: 600;
}

.f-desc {
  opacity: 0.7;
  margin-top: 4px;
}

.right {
  text-align: right;
}

.date {
  opacity: 0.6;
  font-size: 14px;
}

.view-btn {
  margin-top: 8px;
  background: #2d9cdb;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

/* DELETE BUTTON */
.delete-btn {
  margin-top: 8px;
  background: #eb5757;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background: #ff6b6b;
}

.empty {
  text-align: center;
  opacity: 0.6;
  margin-top: 40px;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.25s ease;
  z-index: 999;
}

.modal {
  background: #111;
  padding: 30px;
  width: 420px;
  border-radius: 14px;
  animation: slideUp 0.25s ease;
  border: 1px solid #2a2a2a;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.modal-desc {
  opacity: 0.8;
  margin-bottom: 20px;
}

.modal-info p {
  margin: 6px 0;
  opacity: 0.9;
}

.close-btn {
  margin-top: 20px;
  width: 100%;
  background: #2d9cdb;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>

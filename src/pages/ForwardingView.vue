<template>
  <div class="forwarding-page">
    <Sidebar />

    <div class="main">
      <Navbar :avatar="session.photo" :isUser="true" />

      <div class="content">
        <div class="container">

          <!-- HEADER -->
          <div class="header-row">
            <h2 class="title">Forwarding</h2>
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
                  <h3 class="f-title">{{ item.name }}</h3>
                  <p class="f-desc">{{ item.description }}</p>
                </div>
              </div>

              <div class="right">
                <p class="date">{{ item.createdAt }}</p>

                <button class="view-btn" @click="openModal(item)">
                  View
                </button>
              </div>
            </div>

            <p v-if="forwardings.length === 0" class="empty">
              No forwarding rules created yet.
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ selectedForwarding.name }}</h2>

        <p class="modal-desc">{{ selectedForwarding.description }}</p>

        <div class="modal-info">
          <p><strong>ID:</strong> {{ selectedForwarding.id }}</p>
          <p><strong>Created at:</strong> {{ selectedForwarding.createdAt }}</p>
        </div>

        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"

import { ArrowPathIcon } from "@heroicons/vue/24/outline"

const forwardings = ref([])
const session = ref({})

const showModal = ref(false)
const selectedForwarding = ref(null)

function openModal(item) {
  selectedForwarding.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

onMounted(() => {
  const s = JSON.parse(localStorage.getItem("session"))
  session.value = s || {}

  // 🔥 FORWARDINGS BASED ON REAL APP EVENTS (ENGLISH VERSION)
  forwardings.value = [
    {
      id: 1,
      name: "Infrastructure → Municipal Works",
      description:
        "Events such as potholes, fallen trees, broken streetlights, and water leaks are automatically forwarded to the Municipal Works team.",
      createdAt: "2026-04-10"
    },
    {
      id: 2,
      name: "Traffic → Municipal Police",
      description:
        "Traffic-related incidents, malfunctioning traffic lights, minor accidents, and damaged signs are forwarded directly to the Municipal Police.",
      createdAt: "2026-04-11"
    },
    {
      id: 3,
      name: "Environment → Urban Sanitation",
      description:
        "Full containers, overflowing trash, and environmental issues are forwarded to the Urban Sanitation team.",
      createdAt: "2026-04-12"
    },
    {
      id: 4,
      name: "Security → Public Safety",
      description:
        "Noise complaints, nighttime disturbances, and lost animals are forwarded to the Public Safety team.",
      createdAt: "2026-04-15"
    },
    {
      id: 5,
      name: "Health → Medical Emergency",
      description:
        "Events involving injured individuals or public health concerns are automatically forwarded to the Medical Emergency team.",
      createdAt: "2026-04-17"
    }
  ]
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

/* CUSTOM SCROLLBAR */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0d0d0d;
}

::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3a3a3a;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a #0d0d0d;
}
</style>

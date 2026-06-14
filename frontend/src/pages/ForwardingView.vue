<template>
  <div class="forwarding-page">
    <Sidebar />

    <div class="main">
      <Navbar
        :avatar="session.avatar"
        :isUser="true"
      />

      <div class="content">
        <div class="container">
          <div class="header-row">
            <h2 class="title">Forwardings</h2>
          </div>

          <div v-if="loading" class="empty">
            Loading forwardings...
          </div>

          <div v-else-if="forwardings.length === 0" class="empty">
            No forwardings created yet.
          </div>

          <div v-else class="list">
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
                  <p class="f-desc">
                    Status: <strong>{{ formatStatus(item.status) }}</strong>
                  </p>
                </div>
              </div>

              <div class="right">
                <p class="date">{{ item.forwardedAt }}</p>

                <button class="view-btn" @click="openModal(item)">
                  View
                </button>

                <button
                  v-if="isManager"
                  class="delete-btn"
                  @click="deleteForwarding(item.id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="showModal && selectedForwarding" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2 class="modal-title">{{ selectedForwarding.eventTitle }}</h2>

        <p class="modal-desc">
          <strong>Team:</strong> {{ selectedForwarding.team }}
        </p>

        <p class="modal-desc">
          <strong>Status:</strong> {{ formatStatus(selectedForwarding.status) }}
        </p>

        <div class="modal-info">
          <p><strong>ID:</strong> {{ selectedForwarding.id }}</p>
          <p><strong>Event ID:</strong> {{ selectedForwarding.eventId }}</p>
          <p><strong>Team ID:</strong> {{ selectedForwarding.teamId }}</p>
          <p><strong>Forwarded at:</strong> {{ selectedForwarding.forwardedAt }}</p>
        </div>

        <div v-if="canUpdate" class="status-actions">
          <button @click="updateStatus('pendente')">
            Pendente
          </button>

          <button @click="updateStatus('em_analise')">
            Em análise
          </button>

          <button @click="updateStatus('resolvido')">
            Resolvido
          </button>
        </div>

        <button class="close-btn" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

import api from "@/services/api.js"

import Sidebar from "@/components/Sidebar.vue"
import Navbar from "@/components/Navbar.vue"

import { ArrowPathIcon } from "@heroicons/vue/24/outline"

const forwardings = ref([])
const session = ref({})

const loading = ref(false)
const errorMessage = ref("")

const showModal = ref(false)
const selectedForwarding = ref(null)

const isManager = computed(() => session.value.role === "gestor_municipal")

const canUpdate = computed(() => {
  return ["gestor_municipal", "tecnico"].includes(session.value.role)
})

function splitDescription(rawDescription) {
  if (!rawDescription) return "Untitled event"

  if (rawDescription.includes("—")) {
    return rawDescription.split("—")[0].trim()
  }

  return rawDescription.length > 45
    ? rawDescription.slice(0, 45) + "..."
    : rawDescription
}

// Adapta a resposta da API ao formato apresentado na tabela.
function mapForwardingFromApi(item) {
  const event = item.Event || item.event || {}
  const team = item.Team || item.team || {}

  return {
    id: item.id_encaminhamento,
    eventId: item.id_evento,
    teamId: item.id_equipa,
    eventTitle: splitDescription(event.descricao),
    team: team.nome_equipa || `Team #${item.id_equipa}`,
    status: item.estado_encaminhamento,
    forwardedAt: item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : ""
  }
}

// Carrega a lista atual de encaminhamentos.
async function loadForwardings() {
  loading.value = true
  errorMessage.value = ""

  try {
    const response = await api.get("/forwardings")

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.forwardings || []

    forwardings.value = data.map(mapForwardingFromApi)
  } catch (error) {
    console.error("Error loading forwardings:", error)
    errorMessage.value =
      error.response?.data?.message || "Error loading forwardings."
  } finally {
    loading.value = false
  }
}

// Controla o modal do encaminhamento selecionado.
function openModal(item) {
  selectedForwarding.value = item
  showModal.value = true
}

function closeModal() {
  selectedForwarding.value = null
  showModal.value = false
}

// Atualiza o estado do encaminhamento na API.
async function updateStatus(status) {
  if (!selectedForwarding.value) return

  try {
    await api.patch(`/forwardings/${selectedForwarding.value.id}`, {
      status
    })

    closeModal()
    await loadForwardings()
  } catch (error) {
    console.error("Error updating forwarding:", error)
    errorMessage.value =
      error.response?.data?.message || "Error updating forwarding."
  }
}

// Remove um encaminhamento depois da confirmação.
async function deleteForwarding(id) {
  const confirmed = confirm("Are you sure you want to delete this forwarding?")

  if (!confirmed) return

  try {
    await api.delete(`/forwardings/${id}`)
    await loadForwardings()
  } catch (error) {
    console.error("Error deleting forwarding:", error)
    errorMessage.value =
      error.response?.data?.message || "Error deleting forwarding."
  }
}

function formatStatus(status) {
  if (status === "pendente") return "Pendente"
  if (status === "em_analise") return "Em análise"
  if (status === "resolvido") return "Resolvido"

  return status
}

onMounted(() => {
  const storedSession = JSON.parse(localStorage.getItem("session"))
  session.value = storedSession || {}

  loadForwardings()
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
}

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

.delete-btn {
  margin-top: 8px;
  margin-left: 8px;
  background: #eb5757;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.delete-btn:hover {
  background: #ff6b6b;
}

.empty {
  text-align: center;
  opacity: 0.6;
  margin-top: 40px;
}

.error-message {
  color: #eb5757;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
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
  margin-bottom: 12px;
}

.modal-info p {
  margin: 6px 0;
  opacity: 0.9;
}

.status-actions {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}

.status-actions button {
  flex: 1;
  background: #222;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
}

.status-actions button:hover {
  background: #2d9cdb;
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
